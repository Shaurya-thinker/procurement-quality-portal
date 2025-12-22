from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="Procurement Quality Portal")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data
items = [
    {"id": 1, "name": "Laptop", "code": "LAP-001", "unit": "pcs"},
    {"id": 2, "name": "Mouse", "code": "MOU-001", "unit": "pcs"},
    {"id": 3, "name": "Keyboard", "code": "KEY-001", "unit": "pcs"},
]

purchase_orders = []
po_counter = 1

class POLine(BaseModel):
    item_id: int
    quantity: int
    price: str

class POCreate(BaseModel):
    vendor_id: int
    lines: List[POLine]

class POResponse(BaseModel):
    id: int
    po_number: str
    vendor_id: int
    status: str
    lines: List[dict]

@app.get("/")
def root():
    return {"message": "Procurement Quality Portal API", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/api/v1/procurement/items")
def get_items():
    return items

@app.post("/api/v1/procurement", response_model=POResponse)  # Remove trailing slash
def create_po(po_data: POCreate):
    global po_counter
    
    # Validate items exist
    for line in po_data.lines:
        if not any(item["id"] == line.item_id for item in items):
            raise HTTPException(status_code=400, detail=f"Item {line.item_id} not found")
    
    po = {
        "id": po_counter,
        "po_number": f"PO-{po_counter:04d}",
        "vendor_id": po_data.vendor_id,
        "status": "DRAFT",
        "lines": [line.dict() for line in po_data.lines]
    }
    
    purchase_orders.append(po)
    po_counter += 1
    
    return po

@app.get("/api/v1/procurement")
def list_pos():
    return purchase_orders  # Return array directly, not wrapped in object

@app.get("/api/v1/procurement/{po_id}")
def get_po(po_id: int):
    po = next((po for po in purchase_orders if po["id"] == po_id), None)
    if not po:
        raise HTTPException(status_code=404, detail="PO not found")
    return po

@app.post("/api/v1/procurement/{po_id}/send")
def send_po(po_id: int):
    po = next((po for po in purchase_orders if po["id"] == po_id), None)
    if not po:
        raise HTTPException(status_code=404, detail="PO not found")
    
    if po["status"] == "SENT":
        raise HTTPException(status_code=400, detail="PO already sent")
    
    po["status"] = "SENT"
    return po

if __name__ == "__main__":
    print("Starting Procurement Quality Portal Backend...")
    print("Backend: http://localhost:8002")
    print("API Docs: http://localhost:8002/docs")
    uvicorn.run(app, host="0.0.0.0", port=8002)