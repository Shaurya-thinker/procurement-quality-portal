from sqlalchemy.orm import Session
from datetime import datetime

from backend.app.quality.models.inspection import (
    QualityInspection,
    QualityInspectionLine
)
from backend.app.quality.models.material_receipt import (
    MaterialReceipt,
    MaterialReceiptLine
)
from backend.app.quality.models.gate_pass import (
    GatePass,
    GatePassItem
)
from backend.app.procurement.models.purchase_order_line import PurchaseOrderLine


class GatePassService:

    @staticmethod
    def generate_gate_pass(db: Session, inspection_id: int, issued_by: str, vendor_name: str | None = None, component_details: str | None = None):
        """
        Generate a Gate Pass for an inspection.
        Only accepted quantities are allowed to move to Store.
        """

        # 1️⃣ Validate inspection exists
        inspection = db.query(QualityInspection).filter(
            QualityInspection.id == inspection_id
        ).first()

        if not inspection:
            raise ValueError("Inspection not found")

        # 2️⃣ Ensure gate pass not already generated
        existing = db.query(GatePass).filter(
            GatePass.inspection_id == inspection.id
        ).first()

        if existing:
            raise ValueError("Gate pass already generated for this inspection")

        # 3️⃣ Block rejected inspections
        if inspection.result == "FULLY_REJECTED":
            raise ValueError("Cannot generate gate pass for fully rejected inspection")

        # 4️⃣ Ensure at least one accepted item exists
        if not any(line.accepted_quantity > 0 for line in inspection.lines):
            raise ValueError("No accepted items found for gate pass")

        # 5️⃣ Fetch Material Receipt
        mr = db.query(MaterialReceipt).filter(
            MaterialReceipt.id == inspection.mr_id
        ).first()

        if not mr:
            raise ValueError("Material Receipt not found for inspection")

        # 6️⃣ Create Gate Pass header
        gate_pass = GatePass(
            gate_pass_number=f"GP-{int(datetime.utcnow().timestamp())}",
            po_id=mr.po_id,
            mr_id=mr.id,
            inspection_id=inspection.id,
            issued_by=issued_by,
            issued_at=datetime.utcnow(),
            vendor_name= mr.vendor_name,
            component_details= mr.component_details
        )

        db.add(gate_pass)
        db.flush()  # generate gate_pass.id

        # 7️⃣ Create Gate Pass items (accepted quantities only)
        for inspection_line in inspection.lines:
            if inspection_line.accepted_quantity <= 0:
                continue

            # Get MR line
            mr_line = db.query(MaterialReceiptLine).filter(
                MaterialReceiptLine.id == inspection_line.mr_line_id
            ).first()

            if not mr_line:
                raise ValueError("Material Receipt line not found")

            # Get PO line
            po_line = db.query(PurchaseOrderLine).filter(
                PurchaseOrderLine.id == mr_line.po_line_id
            ).first()

            if not po_line:
                raise ValueError("Purchase Order line not found")

            # Create Gate Pass item
            gate_pass_item = GatePassItem(
                gate_pass_id=gate_pass.id,
                item_id=po_line.item_id,
                accepted_quantity=inspection_line.accepted_quantity
            )

            db.add(gate_pass_item)

        # 9️⃣ Update MR status after gate pass
        mr.status = "GATE_PASSED"

        # 8️⃣ Commit transaction
        db.commit()
        db.refresh(gate_pass)

        return gate_pass

    @staticmethod
    def get_gate_pass(db: Session, gate_pass_id: int):
        gate_pass = db.query(GatePass).filter(
            GatePass.id == gate_pass_id
        ).first()

        if not gate_pass:
            raise ValueError("Gate Pass not found")

        return gate_pass

    @staticmethod
    def list_gate_passes(
        db: Session,
        store_status: str | None = None
    ):
        query = db.query(GatePass)

        if store_status:
            query = query.filter(GatePass.store_status == store_status)

        return query.order_by(GatePass.issued_at.desc()).all()

    @staticmethod
    def dispatch_to_store(db: Session, gate_pass_id: int):
        gate_pass = db.query(GatePass).filter(
            GatePass.id == gate_pass_id
        ).first()

        if not gate_pass:
            raise ValueError("Gate Pass not found")

        if gate_pass.store_status != "PENDING":
            raise ValueError(
                f"Gate Pass already {gate_pass.store_status}"
            )

        gate_pass.store_status = "SENT_TO_STORE"
        db.commit()
        db.refresh(gate_pass)

        return gate_pass
