from fastapi import HTTPException, Header
from typing import Optional



def require_store_role(authorization: Optional[str] = Header(None)):
    """Store role auth dependency - validates store role from token or returns True for demo"""
    # For demo purposes, if authorization header is present, allow access
    # In production, you would validate the token and check the role
    if authorization and authorization.startswith("Bearer "):
        return True
    # Allow access without token for demo
    return True
