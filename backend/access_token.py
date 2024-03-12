import jwt
import os
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from schemas import User, RefreshRequest

load_dotenv()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        decoded_token = jwt.decode(
            token,
            os.getenv("SECRET_KEY"),
            algorithms=["HS256"])
        exp = datetime.fromtimestamp(decoded_token.get("exp"))
        now = datetime.utcnow()
        if now >= exp:
            print(f"Token has expired with {now - exp} seconds ago")
            raise HTTPException(status_code=401, detail="Token has expired")
        print(f"Verified token with {exp - now} seconds left")
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token not valid")


def verify_refresh_token(refresh_request: RefreshRequest):
    # TODO - Verify refresh token better. This is just a placeholder
    try:
        decoded_token = jwt.decode(
            refresh_request.refreshToken,
            os.getenv("SECRET_KEY"),
            algorithms=["HS256"])
        exp = datetime.fromtimestamp(decoded_token.get("exp"))
        now = datetime.utcnow()
        if now >= exp:
            print(f"Token has expired with {now - exp} seconds ago")
            raise HTTPException(status_code=401, detail="Token has expired")
        print(f"Verified token with {exp - now} seconds left")
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token not valid")


def create_access_token(user_data: User):
    to_encode = {
        "email": user_data.email,
    }
    now = datetime.utcnow()
    expire = now + timedelta(minutes=20)
    to_encode.update({"exp": expire.timestamp()})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"),
                             algorithm="HS256")
    return encoded_jwt


def create_refresh_token(user_data: User):
    # TODO - Make refresh token expire after a longer period of time
    to_encode = {
        "email": user_data.email,
    }
    now = datetime.utcnow()
    expire = now + timedelta(days=30)
    to_encode.update({"exp": expire.timestamp()})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"),
                             algorithm="HS256")
    return encoded_jwt
