from datetime import datetime, timedelta
from jose import jwt
from src.core.config import settings


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS)

    to_encode.update({"exp": expire})
    print(f"DEBUG create_access_token: data = {data}")
    print(f"DEBUG create_access_token: JWT_SECRET_KEY = {settings.JWT_SECRET_KEY[:20]}...")
    print(f"DEBUG create_access_token: JWT_ALGORITHM = {settings.JWT_ALGORITHM}")
    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )
    print(f"DEBUG create_access_token: Created token = {encoded_jwt[:50]}...")
    return encoded_jwt
