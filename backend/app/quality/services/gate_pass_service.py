from sqlalchemy.orm import Session
from datetime import datetime

from backend.app.quality.models.inspection import QualityInspection
from backend.app.quality.models.gate_pass import GatePass, GatePassItem


class GatePassService:

    @staticmethod
    def generate_gate_pass(db: Session, inspection_id: int, issued_by: str):
        # 1️⃣ Validate inspection exists
        inspection = db.query(QualityInspection).filter(
            QualityInspection.id == inspection_id
        ).first()

        if not inspection:
            raise ValueError("Inspection not found")

        # 2️⃣ Ensure not already generated
        if inspection.gate_pass:
            raise ValueError("Gate pass already generated")

        # 3️⃣ Validate inspection result
        if inspection.result == "FULLY_REJECTED":
            raise ValueError("Cannot generate gate pass for rejected inspection")

        # 4️⃣ Create gate pass header
        gate_pass = GatePass(
            inspection_id=inspection.id,
            issued_by=issued_by,
            issued_at=datetime.utcnow()
        )

        db.add(gate_pass)
        db.flush()  # get gate_pass.id

        # 5️⃣ Add accepted items only
        has_accepted = False

        for line in inspection.lines:
            if line.accepted_quantity > 0:
                has_accepted = True
                item = GatePassItem(
                    gate_pass_id=gate_pass.id,
                    item_code=line.item_code,
                    quantity=line.accepted_quantity
                )
                db.add(item)

        if not has_accepted:
            raise ValueError("No accepted items found for gate pass")

        db.commit()
        db.refresh(gate_pass)
        return gate_pass
