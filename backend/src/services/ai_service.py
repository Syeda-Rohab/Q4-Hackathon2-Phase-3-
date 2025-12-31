"""
AI Service for natural language processing and chat functionality
Uses OpenAI GPT-4o-mini for intent detection and response generation
OR uses local pattern matching (FREE - no API key needed)
"""

import json
import re
from typing import Dict, Any, Optional
from src.core.config import settings

# Initialize OpenAI client only if API key is valid
client = None
if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "sk-proj-your-openai-key-here":
    try:
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
    except Exception:
        client = None


# System prompt for the AI assistant
SYSTEM_PROMPT = """You are a helpful todo list assistant. Your job is to help users manage their tasks through natural language.

You can understand these intents:
- create_task: User wants to add a new task
- list_tasks: User wants to see their tasks
- update_task: User wants to modify an existing task
- delete_task: User wants to remove a task
- mark_complete: User wants to mark a task as done
- mark_incomplete: User wants to mark a task as not done
- general: General conversation or questions

For each message, respond with a JSON object:
{
  "intent": "one of the above intents",
  "confidence": 0.0-1.0,
  "task_title": "extracted task title if applicable",
  "task_description": "extracted description if provided",
  "due_date": "YYYY-MM-DD format if date mentioned",
  "priority": "low|medium|high if priority mentioned",
  "task_id": "task number if mentioned (e.g., '1', 'first', 'last')",
  "response": "Friendly message to show user"
}

Examples:
User: "Add task: Buy groceries tomorrow"
{
  "intent": "create_task",
  "confidence": 0.95,
  "task_title": "Buy groceries",
  "due_date": "tomorrow",
  "response": "I'll create a task 'Buy groceries' for tomorrow."
}

User: "Show my tasks"
{
  "intent": "list_tasks",
  "confidence": 1.0,
  "response": "Here are your tasks:"
}

User: "Mark the first task as done"
{
  "intent": "mark_complete",
  "confidence": 0.9,
  "task_id": "1",
  "response": "I'll mark your first task as complete."
}

Always extract dates, priorities, and other details from the message.
"""


def process_message_locally(message: str) -> Dict[str, Any]:
    """
    FREE Local AI - Process message using pattern matching (no API needed!)

    Args:
        message: User's input message

    Returns:
        Dictionary containing intent, extracted data, and response
    """
    msg = message.lower().strip()
    result = {
        "intent": "general",
        "confidence": 0.8,
        "response": "I can help you manage tasks! Try: 'add task', 'show tasks', or 'delete task 1'"
    }

    # DELETE TASK patterns (check FIRST before create patterns)
    delete_patterns = [
        r'\b(delete|remove|clear)\s+(?:task\s+)?(\d+|first|last|all)',
        r'\b(delete|remove)\s+(.+?)\s*(?:task)?$',
    ]

    for pattern in delete_patterns:
        match = re.search(pattern, msg)
        if match:
            task_id = match.group(2) if len(match.groups()) >= 2 else match.group(1)
            result = {
                "intent": "delete_task",
                "confidence": 0.85,
                "task_id": task_id.strip(),
                "response": f"I'll delete task {task_id} for you."
            }
            return result

    # MARK COMPLETE patterns (check BEFORE create patterns)
    complete_patterns = [
        r'\b(mark|set|make)\s+(?:task\s+)?(\d+|first|last)\s+(?:as\s+)?(done|complete|completed|finished)',
        r'\b(complete|finish|done)\s+(?:task\s+)?(\d+|first|last)',
    ]

    for pattern in complete_patterns:
        match = re.search(pattern, msg)
        if match:
            task_id = match.group(2) if len(match.groups()) >= 2 else match.group(1)
            result = {
                "intent": "mark_complete",
                "confidence": 0.9,
                "task_id": task_id.strip(),
                "response": f"I'll mark task {task_id} as complete!"
            }
            return result

    # UPDATE TASK patterns (check BEFORE create patterns)
    update_patterns = [
        r'\b(update|change|edit|modify)\s+(?:task\s+)?(\d+|first|last)\s+(?:to\s+)?(.+)',
        r'\b(rename)\s+(?:task\s+)?(\d+|first|last)\s+(?:to\s+)?(.+)',
    ]

    for pattern in update_patterns:
        match = re.search(pattern, msg)
        if match:
            task_id = match.group(2)
            new_title = match.group(3).strip()
            result = {
                "intent": "update_task",
                "confidence": 0.85,
                "task_id": task_id.strip(),
                "task_title": new_title.capitalize(),
                "response": f"I'll update task {task_id} to '{new_title}'!"
            }
            return result

    # LIST TASKS patterns (check BEFORE create patterns)
    list_patterns = [
        r'\b(show|list|display|get|view)\s+(my\s+)?(tasks|todos|all)',
        r'\bwhat\s+(are\s+)?my\s+(tasks|todos)',
        r'\b(tasks|todos)\s*\??$',
    ]

    for pattern in list_patterns:
        if re.search(pattern, msg):
            result = {
                "intent": "list_tasks",
                "confidence": 0.95,
                "response": "Here are your tasks:"
            }

            # Check for filters
            if re.search(r'\b(completed|done|finished)\b', msg):
                result["filter"] = "completed"
            elif re.search(r'\b(pending|incomplete|active)\b', msg):
                result["filter"] = "pending"

            return result

    # CREATE TASK patterns (check LAST to avoid false positives)
    create_patterns = [
        r"(?:add|create|new|make)\s+(?:task|todo)?\s*:?\s*(.+)",
        r"(?:add|create|new|make)\s+(.+?)\s+(?:task|todo)",
    ]

    for pattern in create_patterns:
        match = re.search(pattern, msg, re.IGNORECASE)
        if match:
            task_title = match.group(1).strip()
            # Remove common words
            task_title = re.sub(r'\b(task|todo|for|to)\b', '', task_title, flags=re.IGNORECASE).strip()

            if task_title:
                result = {
                    "intent": "create_task",
                    "confidence": 0.9,
                    "task_title": task_title.capitalize(),
                    "response": f"I'll create '{task_title}' for you!"
                }

                # Check for priority
                if re.search(r'\b(urgent|important|high priority)\b', msg):
                    result["priority"] = "high"
                elif re.search(r'\b(low priority)\b', msg):
                    result["priority"] = "low"
                else:
                    result["priority"] = "medium"

                # Check for dates
                if re.search(r'\b(today)\b', msg):
                    result["due_date"] = "today"
                elif re.search(r'\b(tomorrow)\b', msg):
                    result["due_date"] = "tomorrow"
                elif re.search(r'\b(next week)\b', msg):
                    result["due_date"] = "next week"

                return result

    # HELP patterns
    if re.search(r'\b(help|commands|what can you do|how to use)\b', msg):
        result = {
            "intent": "general",
            "confidence": 1.0,
            "response": """I can help you manage tasks! Try these commands:

* Create: "Add task buy groceries"
* List: "Show my tasks" or "Show completed tasks"
* Complete: "Mark task 1 as done"
* Update: "Change task 1 to buy milk"
* Delete: "Delete task 1"

Just chat naturally and I'll understand!"""
        }
        return result

    return result


async def process_message(message: str, user_id: int) -> Dict[str, Any]:
    """
    Process user message with OpenAI OR local pattern matching

    Args:
        message: User's input message
        user_id: ID of the user (for context if needed)

    Returns:
        Dictionary containing intent, extracted data, and response
    """
    # If OpenAI client is not available, use local processing (FREE!)
    if not client or not settings.ENABLE_AI_CHAT:
        print("Using FREE Local AI (pattern matching)")
        return process_message_locally(message)

    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": message}
            ],
            temperature=0.7,
            max_tokens=settings.OPENAI_MAX_TOKENS
        )

        # Get AI response
        ai_response = response.choices[0].message.content

        # Parse JSON response
        try:
            result = json.loads(ai_response)
        except json.JSONDecodeError:
            # If AI didn't return valid JSON, create a default response
            result = {
                "intent": "general",
                "confidence": 0.5,
                "response": ai_response
            }

        # Ensure required fields exist
        result.setdefault("intent", "general")
        result.setdefault("confidence", 0.8)
        result.setdefault("response", "I'll help you with that.")

        return result

    except Exception as e:
        print(f"WARNING: OpenAI Error: {e}, falling back to local AI")
        # Fallback to local processing if OpenAI fails
        return process_message_locally(message)


async def generate_response(
    intent: str,
    task_data: Optional[Dict[str, Any]] = None,
    error: Optional[str] = None
) -> str:
    """
    Generate a friendly response based on the action taken

    Args:
        intent: The detected intent
        task_data: Task information if applicable
        error: Error message if action failed

    Returns:
        Friendly response string
    """
    if error:
        return f"❌ {error}"

    responses = {
        "create_task": f"✅ Created task '{task_data.get('title', 'Untitled')}' successfully!",
        "list_tasks": "Here are your tasks:",
        "update_task": f"✅ Updated task '{task_data.get('title', '')}' successfully!",
        "delete_task": f"✅ Deleted task '{task_data.get('title', '')}' successfully!",
        "mark_complete": f"✅ Marked task '{task_data.get('title', '')}' as complete!",
        "mark_incomplete": f"✅ Marked task '{task_data.get('title', '')}' as incomplete!",
        "general": "How can I help you with your tasks?"
    }

    return responses.get(intent, "Done!")


# Optional: Function to parse natural language dates
from datetime import datetime, timedelta


def parse_relative_date(date_str: str) -> Optional[str]:
    """
    Convert natural language dates to YYYY-MM-DD format

    Examples:
        "today" -> "2025-12-31"
        "tomorrow" -> "2026-01-01"
        "next week" -> "2026-01-07"

    Args:
        date_str: Natural language date string

    Returns:
        ISO format date string or None
    """
    if not date_str:
        return None

    date_str_lower = date_str.lower().strip()
    today = datetime.now().date()

    date_mappings = {
        "today": today,
        "tomorrow": today + timedelta(days=1),
        "next week": today + timedelta(days=7),
        "next month": today + timedelta(days=30),
    }

    # Check for exact matches
    if date_str_lower in date_mappings:
        return date_mappings[date_str_lower].isoformat()

    # Check for "in X days" pattern
    if "in" in date_str_lower and "day" in date_str_lower:
        try:
            days = int(''.join(filter(str.isdigit, date_str_lower)))
            return (today + timedelta(days=days)).isoformat()
        except (ValueError, TypeError):
            pass

    # Check for "in X weeks" pattern
    if "in" in date_str_lower and "week" in date_str_lower:
        try:
            weeks = int(''.join(filter(str.isdigit, date_str_lower)))
            return (today + timedelta(weeks=weeks)).isoformat()
        except (ValueError, TypeError):
            pass

    return None
