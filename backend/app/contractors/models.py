from sqlalchemy import Column, Integer, String
from app.core.db import Base


class Contractor(Base):
    __tablename__ = "contractors"

    id = Column(Integer, primary_key=True, index=True)

    # Basic identity
    name = Column(String, nullable=False)
    contact_person = Column(String, nullable=True)

    # Contact details
    phone = Column(String, nullable=False)
    alternate_phone = Column(String, nullable=True)
    email = Column(String, nullable=True)

    # Address & notes
    address = Column(String, nullable=True)
    remarks = Column(String, nullable=True)

    # Control
    status = Column(String, default="ACTIVE")  # ACTIVE | INACTIVE | BLACKLISTED