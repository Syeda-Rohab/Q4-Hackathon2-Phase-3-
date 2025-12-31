"""
Chat API endpoints for AI-powered task management
Handles natural language chat interactions
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from sqlmodel.ext.asyncio.session import AsyncSession
from datetime import datetime

from src.api.deps import get_db, get_current_user
from src.models.user import User
from src.models.task import Task
from src.models.chat import ChatMessage, ChatRequest, ChatResponse
from src.services import ai_service, task_service


router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/message", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Process user message with AI and execute appropriate action

    Supports:
    - Creating tasks: "Add task buy milk"
    - Listing tasks: "Show my tasks"
    - Updating tasks: "Change task 1 to buy groceries"
    - Deleting tasks: "Delete task 2"
    - Marking complete: "Mark task 1 as done"
    """
    try:
        # Process message with AI
        ai_result = await ai_service.process_message(request.message, current_user.id)

        intent = ai_result.get("intent", "general")
        task_title = ai_result.get("task_title")
        task_description = ai_result.get("task_description")
        due_date_str = ai_result.get("due_date")
        priority = ai_result.get("priority", "medium")
        task_id_str = ai_result.get("task_id")

        # Convert due_date if provided
        due_date = None
        if due_date_str:
            # Try to parse relative dates
            due_date_iso = ai_service.parse_relative_date(due_date_str)
            if due_date_iso:
                due_date = datetime.fromisoformat(due_date_iso)

        # Execute action based on intent
        action_result = None
        task_id = None

        if intent == "create_task" and task_title:
            # Create new task
            new_task = await task_service.create_task(
                user_id=current_user.id,
                title=task_title,
                description=task_description,
                due_date=due_date,
                priority=priority,
                db=db
            )
            task_id = new_task.id
            response_text = f"✅ Created task '{task_title}' successfully!"
            if due_date:
                response_text += f" Due date: {due_date.strftime('%Y-%m-%d')}"

        elif intent == "list_tasks":
            # Get all tasks
            tasks = await task_service.get_user_tasks(current_user.id, db)
            if not tasks:
                response_text = "You don't have any tasks yet. Create one by saying 'Add task: [task name]'"
            else:
                task_list = "\n".join([
                    f"{i+1}. {'✅' if t.is_completed else '⏳'} {t.title}" +
                    (f" (Due: {t.due_date.strftime('%Y-%m-%d')})" if t.due_date else "")
                    for i, t in enumerate(tasks)
                ])
                response_text = f"Here are your {len(tasks)} tasks:\n\n{task_list}"

        elif intent == "update_task":
            # Update existing task
            if task_id_str:
                try:
                    target_task_id = int(task_id_str)
                    tasks = await task_service.get_user_tasks(current_user.id, db)
                    if 0 < target_task_id <= len(tasks):
                        target_task = tasks[target_task_id - 1]
                        updated_task = await task_service.update_task(
                            task_id=target_task.id,
                            user_id=current_user.id,
                            title=task_title,
                            description=task_description,
                            db=db
                        )
                        response_text = f"✅ Updated task to '{task_title}'"
                        task_id = updated_task.id
                    else:
                        response_text = f"❌ Task number {target_task_id} not found"
                except ValueError:
                    response_text = "❌ Invalid task number"
            else:
                response_text = "❌ Please specify which task to update (e.g., 'Update task 1 to...')"

        elif intent == "delete_task":
            # Delete task
            if task_id_str:
                try:
                    target_task_id = int(task_id_str)
                    tasks = await task_service.get_user_tasks(current_user.id, db)
                    if 0 < target_task_id <= len(tasks):
                        target_task = tasks[target_task_id - 1]
                        await task_service.delete_task(target_task.id, current_user.id, db)
                        response_text = f"✅ Deleted task '{target_task.title}'"
                    else:
                        response_text = f"❌ Task number {target_task_id} not found"
                except ValueError:
                    response_text = "❌ Invalid task number"
            else:
                response_text = "❌ Please specify which task to delete (e.g., 'Delete task 1')"

        elif intent == "mark_complete" or intent == "mark_incomplete":
            # Toggle task completion
            is_completed = (intent == "mark_complete")
            if task_id_str:
                try:
                    target_task_id = int(task_id_str)
                    tasks = await task_service.get_user_tasks(current_user.id, db)
                    if 0 < target_task_id <= len(tasks):
                        target_task = tasks[target_task_id - 1]
                        await task_service.toggle_task_completion(
                            target_task.id,
                            current_user.id,
                            db
                        )
                        status = "complete" if is_completed else "incomplete"
                        response_text = f"✅ Marked '{target_task.title}' as {status}"
                        task_id = target_task.id
                    else:
                        response_text = f"❌ Task number {target_task_id} not found"
                except ValueError:
                    response_text = "❌ Invalid task number"
            else:
                response_text = "❌ Please specify which task (e.g., 'Mark task 1 as done')"

        else:
            # General response
            response_text = ai_result.get("response", "I can help you manage your tasks. Try:\n"
                                                       "- 'Add task: Buy groceries'\n"
                                                       "- 'Show my tasks'\n"
                                                       "- 'Mark task 1 as done'")

        # Save chat message to database
        chat_message = ChatMessage(
            user_id=current_user.id,
            message=request.message,
            bot_response=response_text,
            intent=intent,
            confidence=ai_result.get("confidence", 0.0)
        )
        db.add(chat_message)
        db.commit()

        return ChatResponse(
            response=response_text,
            action=intent,
            task_id=task_id,
            confidence=ai_result.get("confidence")
        )

    except Exception as e:
        print(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
async def get_chat_history(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get recent chat history for the current user"""
    statement = (
        select(ChatMessage)
        .where(ChatMessage.user_id == current_user.id)
        .order_by(ChatMessage.created_at.desc())
        .limit(limit)
    )
    messages = db.exec(statement).all()

    return {
        "messages": [
            {
                "id": msg.id,
                "message": msg.message,
                "response": msg.bot_response,
                "intent": msg.intent,
                "created_at": msg.created_at.isoformat()
            }
            for msg in reversed(messages)  # Reverse to show oldest first
        ]
    }


@router.delete("/history")
async def clear_chat_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Clear all chat history for the current user"""
    statement = select(ChatMessage).where(ChatMessage.user_id == current_user.id)
    messages = db.exec(statement).all()

    for msg in messages:
        db.delete(msg)

    db.commit()

    return {"message": f"Cleared {len(messages)} chat messages"}
