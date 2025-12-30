import hashlib
import secrets
from jose import JWTError, jwt
from datetime import datetime, timedelta
from src.core.config import settings


def hash_password(password: str) -> str:
    """Hash a password using SHA-256 with salt"""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return f"{salt}${pwd_hash}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    try:
        salt, pwd_hash = hashed_password.split('$')
        return pwd_hash == hashlib.sha256((plain_password + salt).encode('utf-8')).hexdigest()
    except (ValueError, AttributeError):
        return False


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.ACCESS_TOKEN_EXPIRE_DAYS)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def verify_token(token: str) -> dict:
    """Decode and verify a JWT token"""
    try:
        print(f"DEBUG verify_token: JWT_SECRET_KEY = {settings.JWT_SECRET_KEY[:20]}...")
        print(f"DEBUG verify_token: JWT_ALGORITHM = {settings.JWT_ALGORITHM}")
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        print(f"DEBUG verify_token: Successfully decoded payload = {payload}")
        return payload
    except JWTError as e:
        print(f"DEBUG verify_token: JWTError - {type(e).__name__}: {str(e)}")
        raise ValueError("Invalid token")
