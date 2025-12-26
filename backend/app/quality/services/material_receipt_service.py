from sqlalchemy.orm import Session
from datetime import datetime

from sqlalchemy import func

from backend.app.quality.models.material_receipt import (
    MaterialReceipt,
    MaterialReceiptLine
)
from backend.app.procurement.models.purchase_order import PurchaseOrder
from backend.app.procurement.models.purchase_order_line import PurchaseOrderLine
from backend.app.procurement.schemas.purchase_order import POStatus


class MaterialReceiptService:

    @staticmethod
    def create_material_receipt(db: Session, data):
        # 1️⃣ Validate PO exists
        po = (
            db.query(PurchaseOrder)
            .filter(PurchaseOrder.id == data.po_id)
            .first()
        )

        if not po:
            raise ValueError("Invalid Purchase Order number")

        # 🚫 Block cancelled PO
        if po.status == POStatus.CANCELLED:
            raise ValueError("Cannot create Material Receipt for a CANCELLED PO")

        # 2️⃣ Create Material Receipt header (UPDATED)
        mr = MaterialReceipt(
            mr_number=f"MR-{int(datetime.utcnow().timestamp())}",

            po_id=data.po_id,
            vendor_id=data.vendor_id,

            vendor_name=data.vendor_name,
            component_details=data.component_details,

            bill_no=data.bill_no,
            entry_no=data.entry_no,
            mr_reference_no=data.mr_reference_no,

            receipt_date=data.receipt_date,

            vehicle_no=data.vehicle_no,
            challan_no=data.challan_no,

            store_id=data.store_id,
            bin_id=data.bin_id,

            remarks=data.remarks,
        )

        db.add(mr)
        db.flush()  # get MR ID

        # 3️⃣ Map PO lines correctly
        po_lines = {line.id: line for line in po.lines}

        # 4️⃣ Validate & create MR lines
        for item in data.lines:
            po_line = po_lines.get(item.po_line_id)

            if not po_line:
                raise ValueError(f"PO line {item.po_line_id} not found in PO")

            if item.received_quantity > po_line.quantity:
                raise ValueError(
                    f"Received quantity exceeds ordered quantity for PO line {item.po_line_id}"
                )

            mr_line = MaterialReceiptLine(
                mr_id=mr.id,
                po_line_id=po_line.id,
                ordered_quantity=po_line.quantity,
                received_quantity=item.received_quantity,
            )

            db.add(mr_line)

        db.commit()
        db.refresh(mr)

        # 5️⃣ Update PO status based on cumulative receipts
        all_po_lines = (
            db.query(PurchaseOrderLine)
            .filter(PurchaseOrderLine.po_id == po.id)
            .all()
        )

        fully_received = True
        partially_received = False

        for po_line in all_po_lines:
            total_received = (
                db.query(MaterialReceiptLine)
                .join(MaterialReceipt)
                .filter(
                    MaterialReceipt.po_id == po.id,
                    MaterialReceiptLine.po_line_id == po_line.id
                )
                .with_entities(
                    func.coalesce(func.sum(MaterialReceiptLine.received_quantity), 0)
                )
                .scalar()
            )

            if total_received == 0:
                fully_received = False
            elif total_received < po_line.quantity:
                fully_received = False
                partially_received = True

        if fully_received:
            po.status = POStatus.RECEIVED
        elif partially_received:
            po.status = POStatus.PARTIALLY_RECEIVED

        db.commit()
        db.refresh(po)

        return mr

    @staticmethod
    def list_material_receipts(db: Session):
        return (
            db.query(MaterialReceipt)
            .order_by(MaterialReceipt.received_at.desc())
            .all()
        )

    @staticmethod
    def get_material_receipt(db: Session, mr_id: int):
        return (
            db.query(MaterialReceipt)
            .filter(MaterialReceipt.id == mr_id)
            .first()
        )
