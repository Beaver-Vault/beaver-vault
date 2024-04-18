from fastapi import HTTPException

def validate_token(token):
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Token not valid"
        )