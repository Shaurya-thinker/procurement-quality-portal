from sqlalchemy.orm import Session
from datetime import datetime

from backend.app.quality.models.material_receipt import (
    MaterialReceipt,
    MaterialReceiptLine
)
from backend.app.quality.models.inspection import (
    QualityInspection,
    QualityInspectionLine
)


class InspectionService:

    @staticmethod
    def inspect_material(db: Session, data):
        # 1️⃣ Validate MR exists
        mr = db.query(MaterialReceipt).filter(
            MaterialReceipt.id == data.mr_id
        ).first()

        if not mr:
            raise ValueError("Material Receipt not found")

        # 2️⃣ Ensure inspection not already done
        existing = db.query(QualityInspection).filter(
            QualityInspection.mr_id == mr.id
        ).first()

        if existing:
            raise ValueError("Inspection already completed for this MR")

        # 3️⃣ Create inspection header
        inspection = QualityInspection(
            mr_id=mr.id,
            inspected_by=data.inspected_by,
            remarks=data.remarks,
            inspected_at=datetime.utcnow(),
            result="PENDING"  # ✅ TEMP VALUE (IMPORTANT)
        )

        db.add(inspection)
        db.flush()  # now INSERT is valid


        total_received = 0
        total_accepted = 0
        total_rejected = 0

        # 4️⃣ Validate & save inspection lines
        for line in data.lines:
            mr_line = db.query(MaterialReceiptLine).filter(
                MaterialReceiptLine.id == line.mr_line_id,
                MaterialReceiptLine.mr_id == mr.id
            ).first()

            if not mr_line:
                raise ValueError(f"MR line {line.mr_line_id} not found")

            if line.accepted_quantity + line.rejected_quantity != mr_line.received_quantity:
                raise ValueError(
                    f"Accepted + Rejected must equal received quantity for MR line {line.mr_line_id}"
                )

            inspection_line = QualityInspectionLine(
                inspection_id=inspection.id,
                mr_line_id=mr_line.id,
                accepted_quantity=line.accepted_quantity,
                rejected_quantity=line.rejected_quantity
            )

            total_received += mr_line.received_quantity
            total_accepted += line.accepted_quantity
            total_rejected += line.rejected_quantity

            db.add(inspection_line)

        # 5️⃣ Compute inspection result
        if total_accepted == total_received:
            inspection.result = "FULLY_ACCEPTED"
        elif total_accepted == 0:
            inspection.result = "FULLY_REJECTED"
        else:
            inspection.result = "PARTIALLY_ACCEPTED"

        # 6️⃣ Update MR status
        mr.status = "INSPECTED"

        db.commit()
        db.refresh(inspection)
        return inspection
    
    @staticmethod
    def get_inspection(db: Session, inspection_id: int):
        return db.query(QualityInspection).filter(
            QualityInspection.id == inspection_id
        ).first()
