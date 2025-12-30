from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from fastapi.security.http import HTTPAuthorizationCredentials
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from src.db.session import get_session
from src.core.security import verify_token

security = HTTPBearer()


async def get_db():
    """Dependency injection for database session"""
    async for session in get_session():
        yield session


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
):
    """Extract and verify JWT token, return current user"""
    try:
        token = credentials.credentials
        print(f"DEBUG: Received token: {token[:50]}...")  # Debug log
        payload = verify_token(token)
        print(f"DEBUG: Token payload: {payload}")  # Debug log
        user_id_raw = payload.get("sub")
        if user_id_raw is None:
            print("DEBUG: No 'sub' found in payload")  # Debug log
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials - missing user ID"
            )
        # Convert to int in case JWT decodes it as string
        user_id = int(user_id_raw)
        print(f"DEBUG: User ID extracted: {user_id}")  # Debug log
    except (ValueError, TypeError) as e:
        print(f"DEBUG: Error in get_current_user: {str(e)}")  # Debug log
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials - {str(e)}"
        )

    # Import here to avoid circular dependency
    from src.models.user import User

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user
