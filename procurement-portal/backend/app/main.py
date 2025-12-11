from fastapi import FastAPI
from app.routers import vendors, purchase_orders, material_requests, quality_control, inventory

app = FastAPI(title="Procurement & Quality Portal API", version="1.0.0")

app.include_router(vendors.router, prefix="/api/v1")
app.include_router(purchase_orders.router, prefix="/api/v1")
app.include_router(material_requests.router, prefix="/api/v1")
app.include_router(quality_control.router, prefix="/api/v1")
app.include_router(inventory.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Procurement & Quality Portal API"}