from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class ChatMessage(SQLModel, table=True):
    """Chat message model for storing user-bot conversations"""

    __tablename__ = "chat_messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", nullable=False, index=True)
    message: str = Field(nullable=False)
    bot_response: Optional[str] = Field(default=None)
    intent: Optional[str] = Field(default=None)  # create_task, list_tasks, etc.
    confidence: Optional[float] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Suggestion(SQLModel, table=True):
    """AI-generated task suggestions"""

    __tablename__ = "suggestions"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", nullable=False, index=True)
    task_id: Optional[int] = Field(foreign_key="tasks.id", default=None)
    suggestion_type: str = Field(nullable=False)  # priority, deadline, group, reminder
    content: str = Field(nullable=False)
    extra_data: Optional[str] = Field(default=None)  # JSON string (renamed from metadata)
    status: str = Field(default="pending")  # pending, accepted, dismissed
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Request/Response Models
class ChatRequest(SQLModel):
    """Chat message request from user"""

    message: str


class ChatResponse(SQLModel):
    """Bot response to user message"""

    response: str
    action: Optional[str] = None  # create_task, update_task, etc.
    task_id: Optional[int] = None
    confidence: Optional[float] = None


class SuggestionResponse(SQLModel):
    """Suggestion data for frontend"""

    id: int
    type: str
    content: str
    task_id: Optional[int]
    status: str
    created_at: datetime
