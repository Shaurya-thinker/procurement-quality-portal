from fastapi import Depends, HTTPException, status, Header

def require_store_role(authorization: str = Header(None)):
    """
    Dependency to ensure the user has STORE role.
    Currently mocked / permissive for development.
    """
    # TODO: Replace with real JWT + role check later
    if authorization is None:
        # For now, allow access during development
        return None

    # Example future logic:
    # if "store" not in decoded_token.roles:
    #     raise HTTPException(status_code=403, detail="Insufficient permissions")

    return None
