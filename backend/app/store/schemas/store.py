from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class BinBase(BaseModel):
    bin_no: str
    component_details: Optional[str] = None
    quantity: int = 0


class BinCreate(BinBase):
    pass


class BinRead(BinBase):
    id: int
    store_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StoreBase(BaseModel):
    store_id: str
    name: str
    plant_name: str
    in_charge_name: str
    in_charge_mobile: str
    in_charge_email: str


class StoreCreate(StoreBase):
    pass


class StoreUpdate(BaseModel):
    name: Optional[str] = None
    plant_name: Optional[str] = None
    in_charge_name: Optional[str] = None
    in_charge_mobile: Optional[str] = None
    in_charge_email: Optional[str] = None


class StoreRead(StoreBase):
    id: int
    created_at: datetime
    updated_at: datetime
    bins: List[BinRead] = []

    class Config:
        from_attributes = True


class StoreDetailRead(StoreRead):
    """Detailed store information including all bins"""
    pass
