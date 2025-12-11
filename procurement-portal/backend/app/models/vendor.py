from pydantic import BaseModel

class Vendor(BaseModel):
    id: str
    name: str
    status: str