from fastapi import HTTPException

def validate_token(token):
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Token not valid"
        )

def is_item_found(item, name):
    if not item:
        raise HTTPException(
            status_code=404,
            detail=f"{name} not found"
        )