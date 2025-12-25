from .material_receipt import router as material_receipt_router
from .inspection import router as inspection_router
from .gate_pass import router as gate_pass_router

__all__ = [
    "material_receipt_router",
    "inspection_router",
    "gate_pass_router",
]
