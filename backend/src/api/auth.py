from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel.ext.asyncio.session import AsyncSession
from src.api.deps import get_db
from src.services.user_service import register_user, authenticate_user
from src.services.auth import create_access_token

router = APIRouter()


class UserCreate(BaseModel):
    """User registration request"""
    email: str
    password: str


class UserLogin(BaseModel):
    """User login request"""
    email: str
    password: str


class TokenResponse(BaseModel):
    """Authentication response with JWT token"""
    id: int
    email: str
    access_token: str
    token_type: str = "bearer"


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user"""
    user = await register_user(db, user_data.email, user_data.password)
    access_token = create_access_token(data={"sub": str(user.id)})  # Convert to string!
    return TokenResponse(
        id=user.id,
        email=user.email,
        access_token=access_token
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login with email and password"""
    user = await authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    access_token = create_access_token(data={"sub": str(user.id)})  # Convert to string!
    return TokenResponse(
        id=user.id,
        email=user.email,
        access_token=access_token
    )
