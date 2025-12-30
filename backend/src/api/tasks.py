from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from datetime import datetime
from sqlmodel.ext.asyncio.session import AsyncSession
from src.api.deps import get_db, get_current_user
from src.models.user import User
from src.models.task import Task
from src.services.task_service import (
    create_task,
    get_user_tasks,
    get_task_by_id,
    update_task,
    delete_task,
    toggle_task_status
)

router = APIRouter()


class TaskCreate(BaseModel):
    """Task creation request"""
    title: str
    description: str | None = None


class TaskUpdate(BaseModel):
    """Task update request"""
    title: str | None = None
    description: str | None = None
    status: str | None = None


class TaskResponse(BaseModel):
    """Task response"""
    id: int
    user_id: int
    title: str
    description: str | None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_new_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new task"""
    task = await create_task(db, current_user.id, task_data.title, task_data.description)
    return task


@router.get("/", response_model=list[TaskResponse])
async def get_tasks(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all tasks for the current user"""
    tasks = await get_user_tasks(db, current_user.id)
    return tasks


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific task"""
    task = await get_task_by_id(db, task_id, current_user.id)
    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_existing_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a task"""
    task = await update_task(
        db,
        task_id,
        current_user.id,
        task_data.title,
        task_data.description,
        task_data.status
    )
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a task"""
    await delete_task(db, task_id, current_user.id)
    return None


@router.post("/{task_id}/toggle", response_model=TaskResponse)
async def toggle_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Toggle task status between Complete and Incomplete"""
    task = await toggle_task_status(db, task_id, current_user.id)
    return task
