def generate_id(prefix: str) -> str:
    import uuid
    return f"{prefix}{str(uuid.uuid4())[:8]}"