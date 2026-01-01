import random
import string
from datetime import datetime
from typing import List, Optional
import os

import requests

from sqlalchemy.orm import Session
from sqlalchemy import and_
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from app.procurement.models import PurchaseOrder, Item
from app.procurement.schemas.purchase_order import (PurchaseOrderDetailRead, PurchaseOrderLineDetailRead,)
from app.procurement.schemas.item import ItemCreate, ItemRead
from app.store.models.material_dispatch import MaterialDispatch, MaterialDispatchLineItem

from app.procurement.models import (
    PurchaseOrder,
    PurchaseOrderLine,
    Item,
    POStatus,
)
from app.procurement.schemas import (
    PurchaseOrderCreate,
    PurchaseOrderRead,
    PurchaseOrderLineRead,
    PurchaseOrderUpdate,
    VendorRead,
    PurchaseOrderTracking,
)


class ProcurementService:
    """Service for procurement-related business logic."""

    @staticmethod
    def create_item(db: Session, item_data: ItemCreate):
        """
        Create a new item in item master.
        Used ONLY for internal/testing purposes.
        """

        item = Item(
            name=item_data.name,
            code=item_data.code,
            unit=item_data.unit,
            description=item_data.description,
        )

        db.add(item)

        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise ValueError("Item with this code already exists")

        db.refresh(item)
        return item
    
    @staticmethod
    def get_all_items(db: Session):
        """
        Fetch all items for procurement dropdowns (read-only).
        """
        return db.query(Item).order_by(Item.name).all()


    
    @staticmethod
    def _generate_po_number() -> str:
        """Generate a unique purchase order number."""
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f"PO-{timestamp}-{random_suffix}"
    
    @staticmethod
    def _validate_vendor_id(vendor_id: int) -> None:
        """Validate vendor_id is positive."""
        if vendor_id <= 0:
            raise ValueError("vendor_id must be greater than 0")
        

    @staticmethod
    def _validate_no_duplicate_items(item_ids: List[int]) -> None:
        """
        Ensure no duplicate item IDs are present in a single PO.
        """
        if len(item_ids) != len(set(item_ids)):
            raise ValueError("Duplicate items are not allowed in a single purchase order")
        
    @staticmethod
    def _validate_items_exist(db: Session, item_ids: List[int]) -> None:
        """Validate that all items exist in the database."""
        if not item_ids:
            raise ValueError("At least one item is required")
        
        existing_items = db.query(Item.id).filter(Item.id.in_(item_ids)).all()
        existing_ids = {item[0] for item in existing_items}
        missing_ids = set(item_ids) - existing_ids
        
        if missing_ids:
            raise ValueError(f"Items with IDs {missing_ids} do not exist")
        

# IMPORTANT:
# We trust ONLY item_id from client.
# Item name, unit, and description are always derived from Item Master.

    @staticmethod
    def create_purchase_order(
        db: Session,
        po_create: PurchaseOrderCreate
    ) -> PurchaseOrderRead:
        """
        Create a new purchase order with line items.
        
        Args:
            db: Database session
            po_create: PurchaseOrderCreate schema
            
        Returns:
            PurchaseOrderRead: Created purchase order
            
        Raises:
            ValueError: If validation fails
        """
        # Validate vendor_id
        ProcurementService._validate_vendor_id(po_create.vendor_id)
        
        # Extract item IDs and validate they exist
        item_ids = [line.item_id for line in po_create.lines]
        ProcurementService._validate_no_duplicate_items(item_ids)
        ProcurementService._validate_items_exist(db, item_ids)

        
        try:
            # Generate unique PO number
            po_number = ProcurementService._generate_po_number()
            
            # Create purchase order
            db_po = PurchaseOrder(
                po_number=po_number,
                vendor_id=po_create.vendor_id,
                status=POStatus.DRAFT
            )
            db.add(db_po)
            db.flush()  # Flush to get the PO ID without committing
            
            # Capture PO data before it gets expired
            po_id = db_po.id
            po_created_at = db_po.created_at
            
            # Create purchase order lines
            lines_data = []
            for line_create in po_create.lines:
                db_line = PurchaseOrderLine(
                    po_id=po_id,
                    item_id=line_create.item_id,
                    quantity=line_create.quantity,
                    price=line_create.price
                )
                db.add(db_line)
                # Capture line data before it gets expired
                db.flush()
                lines_data.append({
                    "id": db_line.id,
                    "po_id": db_line.po_id,
                    "item_id": db_line.item_id,
                    "quantity": db_line.quantity,
                    "price": db_line.price,
                })
            
            db.commit()
            
            # Build response dict from captured data
            po_dict = {
                "id": po_id,
                "po_number": po_number,
                "vendor_id": po_create.vendor_id,
                "status": POStatus.DRAFT,
                "created_at": po_created_at,
                "lines": lines_data
            }
            return PurchaseOrderRead.model_validate(po_dict)
        
        except Exception as e:
            db.rollback()
            raise e
        

    @staticmethod
    def cancel_purchase_order(db: Session, po_id: int):
        db_po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()

        if not db_po:
            raise ValueError(f"Purchase order with ID {po_id} not found")

        if db_po.status == POStatus.CANCELLED:
            raise ValueError("Purchase order is already cancelled")

        # 🚫 Business rule: cannot cancel after receipt/QC (future-safe)
        # (For now, allow cancel if not already cancelled)
        if db_po.status not in [POStatus.DRAFT, POStatus.SENT]:
            raise ValueError("Purchase order cannot be cancelled")

        db_po.status = POStatus.CANCELLED
        db.commit()

        return PurchaseOrderRead.model_validate({
            "id": db_po.id,
            "po_number": db_po.po_number,
            "vendor_id": db_po.vendor_id,
            "status": db_po.status,
            "created_at": db_po.created_at,
            "lines": [
                {
                    "id": line.id,
                    "po_id": line.po_id,
                    "item_id": line.item_id,
                    "quantity": line.quantity,
                    "price": line.price,
                }
                for line in db_po.lines
            ]
        })    
    
    
    @staticmethod
    def get_purchase_orders(
        db: Session,
        status: Optional[POStatus] = None,
        page: int = 1,
        page_size: int = 25
    ) -> dict:
        """
        Get purchase orders with pagination and optional status filtering.
        
        Args:
            db: Database session
            status: Optional status filter
            page: Page number (1-indexed)
            page_size: Number of items per page
            
        Returns:
            Dictionary with items and pagination metadata
        """
        if page < 1:
            page = 1
        if page_size < 1:
            page_size = 25
        
        query = db.query(PurchaseOrder)
        
        # Filter by status if provided
        if status:
            query = query.filter(PurchaseOrder.status == status)
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * page_size
        purchase_orders = query.order_by(PurchaseOrder.created_at.desc()).offset(offset).limit(page_size).all()
        
        return {
            "items": [
                PurchaseOrderRead.model_validate({
                    "id": po.id,
                    "po_number": po.po_number,
                    "vendor_id": po.vendor_id,
                    "status": po.status,
                    "created_at": po.created_at,
                    "lines": [
                        {
                            "id": line.id,
                            "po_id": line.po_id,
                            "item_id": line.item_id,
                            "quantity": line.quantity,
                            "price": line.price,
                        }
                        for line in po.lines
                    ]
                })
                for po in purchase_orders
            ],
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }
    
    @staticmethod

    def get_purchase_order(db: Session, po_id: int):
        db_po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()

        if not db_po:
            raise ValueError(f"Purchase order with ID {po_id} not found")

        line_items = []
        for line in db_po.lines:
            item = db.query(Item).filter(Item.id == line.item_id).first()

            line_items.append(
                PurchaseOrderLineDetailRead(
                    id=line.id,
                    item_id=line.item_id,
                    item_code=item.code if item else "",
                    item_description=item.name if item else "",
                    unit=item.unit if item else "",
                    quantity=line.quantity,
                    rate=line.price,
                )
            )

        return PurchaseOrderDetailRead(
            id=db_po.id,
            po_number=db_po.po_number,
            vendor_id=db_po.vendor_id,
            status=db_po.status,
            created_at=db_po.created_at,
            line_items=line_items,
        )

    
    @staticmethod
    def send_purchase_order(db: Session, po_id: int) -> PurchaseOrderRead:
        """
        Send a purchase order (set status to SENT).
        
        Args:
            db: Database session
            po_id: Purchase order ID
            
        Returns:
            PurchaseOrderRead: Updated purchase order
            
        Raises:
            ValueError: If purchase order not found or cannot be sent
        """
        db_po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
        
        if not db_po:
            raise ValueError(f"Purchase order with ID {po_id} not found")
        
        if db_po.status == POStatus.SENT:
            raise ValueError(f"Purchase order {db_po.po_number} is already sent")
        
        db_po.status = POStatus.SENT
        db.commit()
        
        # Build response dict
        po_dict = {
            "id": db_po.id,
            "po_number": db_po.po_number,
            "vendor_id": db_po.vendor_id,
            "status": db_po.status,
            "created_at": db_po.created_at,
            "lines": [
                {
                    "id": line.id,
                    "po_id": line.po_id,
                    "item_id": line.item_id,
                    "quantity": line.quantity,
                    "price": line.price,
                }
                for line in db_po.lines
            ]
        }
        return PurchaseOrderRead.model_validate(po_dict)

    @staticmethod
    def update_purchase_order(db: Session, po_id: int, po_update: PurchaseOrderUpdate) -> PurchaseOrderRead:
        """
        Update a purchase order. Only allowed when status == DRAFT.

        - vendor_id may be updated
        - lines may be replaced (full replace)
        """
        db_po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()

        if not db_po:
            raise ValueError(f"Purchase order with ID {po_id} not found")

        if db_po.status != POStatus.DRAFT:
            raise ValueError("Only DRAFT purchase orders can be updated")

        try:
            # Update vendor_id if provided
            if po_update.vendor_id is not None:
                ProcurementService._validate_vendor_id(po_update.vendor_id)
                db_po.vendor_id = po_update.vendor_id

            # Replace lines if provided
            lines_data = []
            if po_update.lines is not None:
                item_ids = [line.item_id for line in po_update.lines]
                ProcurementService._validate_no_duplicate_items(item_ids)
                ProcurementService._validate_items_exist(db, item_ids)

                # Clear existing lines through relationship (cascade will delete)
                db_po.lines.clear()
                db.flush()

                for line_create in po_update.lines:
                    db_line = PurchaseOrderLine(
                        po_id=db_po.id,
                        item_id=line_create.item_id,
                        quantity=line_create.quantity,
                        price=line_create.price,
                    )
                    db.add(db_line)
                    db.flush()
                    lines_data.append({
                        "id": db_line.id,
                        "po_id": db_line.po_id,
                        "item_id": db_line.item_id,
                        "quantity": db_line.quantity,
                        "price": db_line.price,
                    })
            else:
                # Keep existing lines
                lines_data = [
                    {
                        "id": line.id,
                        "po_id": line.po_id,
                        "item_id": line.item_id,
                        "quantity": line.quantity,
                        "price": line.price,
                    }
                    for line in db_po.lines
                ]

            db.commit()

            po_dict = {
                "id": db_po.id,
                "po_number": db_po.po_number,
                "vendor_id": db_po.vendor_id,
                "status": db_po.status,
                "created_at": db_po.created_at,
                "lines": lines_data,
            }
            return PurchaseOrderRead.model_validate(po_dict)

        except Exception as e:
            db.rollback()
            raise e

    @staticmethod
    def get_vendor_details(db: Session, vendor_id: int) -> VendorRead:
        """
        Retrieve vendor details from external Vendor Portal.
        Falls back safely if service is unavailable.
        """

        base_url = os.getenv("VENDOR_PORTAL_URL", "http://localhost:9000/api/vendors")
        url = f"{base_url}/{vendor_id}"

        try:
            resp = requests.get(url, timeout=2)

            if resp.status_code == 200:
                data = resp.json()
                return VendorRead.model_validate({
                    "id": int(data.get("id", vendor_id)),
                    "name": data.get("name", "Unknown Vendor"),
                    "contact": data.get("contact"),
                    "status": data.get("status", "ACTIVE"),
                })

        except Exception:
            pass  # swallow vendor service errors

        # ✅ SAFE FALLBACK — NEVER THROW 500
        return VendorRead.model_validate({
            "id": vendor_id,
            "name": "Unknown Vendor",
            "contact": None,
            "status": "UNKNOWN",
        })


    @staticmethod
    def get_po_tracking_summary(db: Session, po_id: int) -> PurchaseOrderTracking:
        """
        Return a consolidated tracking summary for a purchase order.

        Tries to read material receipt and QC inspection information from the
        `app.quality` module if available. This function is read-only
        with respect to quality module data.
        """
        # Get basic PO info
        db_po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
        if not db_po:
            raise ValueError(f"Purchase order with ID {po_id} not found")

        material_receipt_status = None
        qc_accepted = 0
        qc_rejected = 0

        # Defensive: try to import quality models/services if the quality module exists
        try:
            from app.quality import models as quality_models
            # Commonly, material receipt and qc tables may reference po_id
            MaterialReceipt = getattr(quality_models, "MaterialReceipt", None)
            QCInspection = getattr(quality_models, "QCInspection", None)

            if MaterialReceipt is not None:
                mr = db.query(MaterialReceipt).filter(getattr(MaterialReceipt, "po_id") == po_id).order_by(getattr(MaterialReceipt, "received_at", MaterialReceipt.id).desc()).first()
                if mr is not None:
                    # Try common field names defensively
                    material_receipt_status = getattr(mr, "status", None) or getattr(mr, "receipt_status", None)

            if QCInspection is not None:
                # Sum accepted/rejected quantities if fields exist
                accepted_field = getattr(QCInspection, "accepted_quantity", None)
                rejected_field = getattr(QCInspection, "rejected_quantity", None)
                po_field = getattr(QCInspection, "po_id", None)
                if po_field is not None and accepted_field is not None and rejected_field is not None:
                    rows = db.query(QCInspection).filter(po_field == po_id).all()
                    for r in rows:
                        qc_accepted += int(getattr(r, "accepted_quantity", 0) or 0)
                        qc_rejected += int(getattr(r, "rejected_quantity", 0) or 0)

        except Exception:
            # If quality module absent or queries fail, fall back to defaults
            material_receipt_status = material_receipt_status

        tracking = {
            "id": db_po.id,
            "po_number": db_po.po_number,
            "status": db_po.status,
            "material_receipt_status": material_receipt_status,
            "qc_accepted_quantity": qc_accepted,
            "qc_rejected_quantity": qc_rejected,
        }

        return PurchaseOrderTracking.model_validate(tracking)

    @staticmethod
    def get_purchase_orders_by_vendor(db: Session, vendor_id: int) -> dict:
        """
        Get all purchase orders for a specific vendor.
        
        Args:
            db: Database session
            vendor_id: Vendor ID
            
        Returns:
            Dictionary with purchase orders for the vendor
            
        Raises:
            ValueError: If vendor_id is invalid
        """
        ProcurementService._validate_vendor_id(vendor_id)
        
        purchase_orders = db.query(PurchaseOrder).filter(
            PurchaseOrder.vendor_id == vendor_id
        ).order_by(PurchaseOrder.created_at.desc()).all()
        
        return {
            "vendor_id": vendor_id,
            "items": [
                PurchaseOrderRead.model_validate({
                    "id": po.id,
                    "po_number": po.po_number,
                    "vendor_id": po.vendor_id,
                    "status": po.status,
                    "created_at": po.created_at,
                    "lines": [
                        {
                            "id": line.id,
                            "po_id": line.po_id,
                            "item_id": line.item_id,
                            "quantity": line.quantity,
                            "price": line.price,
                        }
                        for line in po.lines
                    ]
                })
                for po in purchase_orders
            ],
            "total": len(purchase_orders)
        }

    @staticmethod
    def get_po_items_with_pending_qty(db: Session, po_id: int):
        """
        Return PO items with ordered, dispatched and pending quantity
        """

        # Subquery: dispatched quantity per item for this PO
        dispatched_subq = (
            db.query(
                MaterialDispatchLineItem.item_id,
                func.coalesce(func.sum(MaterialDispatchLineItem.quantity_dispatched), 0)
                .label("dispatched_qty")
            )
            .join(MaterialDispatch, MaterialDispatch.id == MaterialDispatchLineItem.dispatch_id)
            .filter(
                MaterialDispatch.reference_type == "PO",
                MaterialDispatch.reference_id == str(po_id),
                MaterialDispatch.dispatch_status != "CANCELLED"
            )
            .group_by(MaterialDispatchLineItem.item_id)
            .subquery()
        )

        # Main query
        results = (
            db.query(
                PurchaseOrderLine.item_id,
                PurchaseOrderLine.quantity.label("ordered_qty"),
                func.coalesce(dispatched_subq.c.dispatched_qty, 0).label("dispatched_qty")
            )
            .outerjoin(
                dispatched_subq,
                dispatched_subq.c.item_id == PurchaseOrderLine.item_id
            )
            .filter(PurchaseOrderLine.po_id == po_id)
            .all()
        )

        return [
            {
                "item_id": r.item_id,
                "ordered_qty": r.ordered_qty,
                "already_dispatched": float(r.dispatched_qty),
                "pending_qty": max(r.ordered_qty - float(r.dispatched_qty), 0)
            }
            for r in results
        ]
