# Phase III Implementation Plan: AI-Powered Todo App

**Feature**: AI Chatbot, Voice Commands & Smart Suggestions
**Branch**: `002-ai-chatbot`
**Estimated Timeline**: 4 weeks
**Status**: Planning

## Architecture Overview

### Tech Stack Additions

**AI/LLM:**
- OpenAI GPT-4o-mini (primary choice - fast & affordable)
- Fallback: Google Gemini Flash (free tier)

**Frontend Libraries:**
```
- openai (4.x) - API client
- react-speech-recognition - Voice input
- framer-motion - Animations
- date-fns - Date parsing
```

**Backend Libraries:**
```python
- openai (1.x) - Python SDK
- python-dateutil - Natural date parsing
- python-multipart - File uploads (future)
```

## System Design

### Component Architecture

```
┌─────────────────────────────────────────┐
│           Frontend (Next.js)            │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────┐  ┌────────────────┐ │
│  │   Dashboard   │  │  Chat Widget   │ │
│  │   (Phase II)  │  │   (Phase III)  │ │
│  └───────┬───────┘  └────────┬───────┘ │
│          │                   │         │
│          │  ┌────────────────┴──────┐  │
│          │  │   Voice Recognition   │  │
│          │  │    (Web Speech API)   │  │
│          │  └───────────────────────┘  │
│          │                             │
└──────────┼─────────────────────────────┘
           │
           │ HTTP/REST
           ▼
┌─────────────────────────────────────────┐
│          Backend (FastAPI)              │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐  ┌────────────────────┐  │
│  │   Task   │  │   Chat Service     │  │
│  │   API    │  │  + NLP Processing  │  │
│  │(Phase II)│  │    (Phase III)     │  │
│  └────┬─────┘  └──────┬─────────────┘  │
│       │                │                │
│       │    ┌───────────┴──────────┐    │
│       │    │  OpenAI API Client   │    │
│       │    │  (External Service)  │    │
│       │    └──────────────────────┘    │
│       │                │                │
│       ▼                ▼                │
│  ┌──────────────────────────────────┐  │
│  │    PostgreSQL / SQLite DB        │  │
│  │  - users, tasks (Phase II)       │  │
│  │  - chat_messages (Phase III)     │  │
│  │  - suggestions (Phase III)       │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Data Flow: Chat Message

```
User Types/Speaks Message
      │
      ▼
[Voice API converts speech → text] (if voice)
      │
      ▼
Frontend sends to /api/chat/message
      │
      ▼
Backend: Extract intent & entities
      │
      ▼
OpenAI API: Process with context
      │
      ▼
Backend: Execute action (create/update/delete task)
      │
      ▼
Backend: Generate friendly response
      │
      ▼
Frontend: Display bot message
      │
      ▼
Update task list in UI
```

## Database Schema Updates

### New Tables

```sql
-- Chat message history
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    bot_response TEXT,
    intent VARCHAR(50),  -- create_task, list_tasks, update_task, etc.
    confidence FLOAT,    -- NLP confidence score
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_created (user_id, created_at DESC)
);

-- AI-generated suggestions
CREATE TABLE suggestions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    suggestion_type VARCHAR(50) NOT NULL,  -- priority, deadline, group, reminder
    content TEXT NOT NULL,
    metadata JSONB,  -- Additional context
    status VARCHAR(20) DEFAULT 'pending',  -- pending, accepted, dismissed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_status (user_id, status)
);

-- Voice transcriptions (optional - for debugging)
CREATE TABLE voice_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transcript TEXT,
    confidence FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Alembic Migration

**File**: `alembic/versions/002_add_ai_features.py`

```python
"""Add AI chatbot and suggestions tables

Revision ID: 002
Revises: 001
"""

def upgrade():
    # Create chat_messages table
    op.create_table(
        'chat_messages',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('bot_response', sa.Text()),
        sa.Column('intent', sa.String(50)),
        sa.Column('confidence', sa.Float()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE')
    )

    # Create suggestions table
    op.create_table(
        'suggestions',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('task_id', sa.Integer()),
        sa.Column('suggestion_type', sa.String(50), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('metadata', sa.JSON()),
        sa.Column('status', sa.String(20), server_default='pending'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], ondelete='CASCADE')
    )

def downgrade():
    op.drop_table('suggestions')
    op.drop_table('chat_messages')
```

## API Design

### New Endpoints

**Chat Endpoints:**
```python
POST   /api/chat/message
  Request: {"message": "Add task buy milk tomorrow"}
  Response: {
    "response": "✓ Created task 'Buy milk' with due date 2025-01-01",
    "action": "create_task",
    "task_id": 123
  }

GET    /api/chat/history?limit=50
  Response: {
    "messages": [
      {"id": 1, "message": "Show tasks", "response": "You have 5 tasks...", "created_at": "..."},
      ...
    ]
  }

DELETE /api/chat/history
  Response: {"message": "Chat history cleared"}
```

**Suggestions Endpoints:**
```python
GET    /api/suggestions
  Response: {
    "suggestions": [
      {
        "id": 1,
        "type": "priority",
        "content": "Task 'Homework' seems urgent. Set priority to high?",
        "task_id": 5,
        "status": "pending"
      },
      ...
    ]
  }

POST   /api/suggestions/{id}/accept
  Response: {"message": "Suggestion applied", "task_id": 5}

POST   /api/suggestions/{id}/dismiss
  Response: {"message": "Suggestion dismissed"}

POST   /api/suggestions/generate
  Request: {"task_ids": [1, 2, 3]}  # Optional: specific tasks
  Response: {"count": 3, "suggestions": [...]}
```

## Implementation Phases

### Phase 3.1: Backend AI Foundation (Days 1-3)

**Tasks:**
1. ✅ Install dependencies: `openai`, `python-dateutil`
2. ✅ Create `.env` variables for API keys
3. ✅ Create `src/services/ai_service.py`:
   - `process_chat_message(user_id, message)` → intent + response
   - `extract_intent(message)` → Intent enum
   - `extract_task_entities(message)` → {title, description, due_date, priority}
4. ✅ Create `src/services/nlp_service.py`:
   - Date parsing: "tomorrow", "next week", "in 3 days"
   - Priority detection: "urgent", "important" → high
5. ✅ Create chat endpoints in `src/api/chat.py`
6. ✅ Create database models in `src/models/chat.py`
7. ✅ Create migration file
8. ✅ Test with Postman/curl

**Example AI Service:**
```python
# src/services/ai_service.py
from openai import OpenAI
from src.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

SYSTEM_PROMPT = """
You are a helpful todo list assistant. Extract user intent and task details.
Respond in JSON format:
{
  "intent": "create_task|list_tasks|update_task|delete_task|mark_complete|general",
  "task_title": "...",
  "task_description": "...",
  "due_date": "YYYY-MM-DD",
  "priority": "low|medium|high",
  "response": "User-friendly message"
}
"""

async def process_message(user_id: int, message: str, context: list = None):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    if context:
        messages.extend(context)

    messages.append({"role": "user", "content": message})

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.7,
        max_tokens=300
    )

    return parse_ai_response(response.choices[0].message.content)
```

### Phase 3.2: Frontend Chat UI (Days 4-7)

**Tasks:**
1. ✅ Create `frontend/components/ChatWidget.tsx`
2. ✅ Create `frontend/components/ChatMessage.tsx`
3. ✅ Create `frontend/components/ChatInput.tsx`
4. ✅ Create `frontend/lib/chatApi.ts`
5. ✅ Create `frontend/hooks/useChat.ts`
6. ✅ Add chat toggle button to dashboard
7. ✅ Style with Tailwind (mobile-responsive)
8. ✅ Test chat flow end-to-end

**ChatWidget Component:**
```tsx
// frontend/components/ChatWidget.tsx
'use client';

import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, isLoading } = useChat();

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between">
            <h3 className="font-semibold">Todo AI Assistant</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && <div className="text-gray-400">Bot is typing...</div>}
          </div>

          {/* Input */}
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      )}
    </>
  );
}
```

### Phase 3.3: Voice Commands (Days 8-10)

**Tasks:**
1. ✅ Install `react-speech-recognition`
2. ✅ Create `frontend/components/VoiceButton.tsx`
3. ✅ Create `frontend/hooks/useVoice.ts`
4. ✅ Integrate voice input with chat
5. ✅ Add visual feedback (recording indicator)
6. ✅ Handle browser compatibility
7. ✅ Test on Chrome, Safari, Firefox

**Voice Integration:**
```tsx
// frontend/hooks/useVoice.ts
import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const startListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: false });
  };

  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: browserSupportsSpeechRecognition
  };
}
```

### Phase 3.4: Smart Suggestions (Days 11-14)

**Tasks:**
1. ✅ Create `src/services/suggestion_service.py`
2. ✅ Implement priority detection
3. ✅ Implement due date extraction
4. ✅ Implement task grouping algorithm
5. ✅ Create suggestions API endpoints
6. ✅ Create frontend suggestion cards
7. ✅ Add accept/dismiss actions
8. ✅ Test suggestion flow

**Suggestion Logic:**
```python
# src/services/suggestion_service.py
from datetime import datetime, timedelta
from typing import List
from src.models.task import Task
from src.models.chat import Suggestion

URGENT_KEYWORDS = ['urgent', 'asap', 'important', 'critical', 'emergency']
LOW_PRIORITY_KEYWORDS = ['later', 'someday', 'eventually', 'maybe']

async def generate_priority_suggestions(tasks: List[Task], user_id: int) -> List[Suggestion]:
    suggestions = []

    for task in tasks:
        if task.priority != 'high':
            title_lower = task.title.lower()
            desc_lower = (task.description or '').lower()

            # Check for urgent keywords
            if any(keyword in title_lower or keyword in desc_lower for keyword in URGENT_KEYWORDS):
                suggestions.append(Suggestion(
                    user_id=user_id,
                    task_id=task.id,
                    suggestion_type='priority',
                    content=f"Task '{task.title}' contains urgent keywords. Set priority to high?",
                    metadata={'current_priority': task.priority, 'suggested_priority': 'high'}
                ))

    return suggestions

async def generate_deadline_suggestions(tasks: List[Task], user_id: int) -> List[Suggestion]:
    suggestions = []

    for task in tasks:
        if not task.due_date:
            # Suggest deadline based on keywords
            title_lower = task.title.lower()

            if 'today' in title_lower:
                suggested_date = datetime.now().date()
            elif 'tomorrow' in title_lower:
                suggested_date = (datetime.now() + timedelta(days=1)).date()
            elif 'week' in title_lower:
                suggested_date = (datetime.now() + timedelta(days=7)).date()
            else:
                continue

            suggestions.append(Suggestion(
                user_id=user_id,
                task_id=task.id,
                suggestion_type='deadline',
                content=f"Set due date for '{task.title}' to {suggested_date}?",
                metadata={'suggested_date': str(suggested_date)}
            ))

    return suggestions
```

### Phase 3.5: Testing & Polish (Days 15-18)

**Tasks:**
1. ✅ Write unit tests for AI service
2. ✅ Write integration tests for chat flow
3. ✅ Test voice on multiple browsers
4. ✅ Test suggestions accuracy
5. ✅ Mobile responsiveness testing
6. ✅ Performance optimization
7. ✅ UI/UX improvements
8. ✅ Documentation updates

## Environment Setup

### Backend `.env` Additions
```env
# AI Configuration
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=300

# Feature Flags
ENABLE_AI_CHAT=true
ENABLE_VOICE=true
ENABLE_SUGGESTIONS=true

# Rate Limiting
CHAT_RATE_LIMIT=60  # requests per minute per user
```

### Frontend `.env.local` Additions
```env
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_VOICE=true
NEXT_PUBLIC_ENABLE_SUGGESTIONS=true
```

## Testing Strategy

### Backend Tests
```python
# tests/test_ai_service.py
async def test_extract_create_task_intent():
    result = await extract_intent("Add task buy milk")
    assert result.intent == "create_task"
    assert "buy milk" in result.task_title.lower()

async def test_date_parsing():
    result = await parse_date("tomorrow")
    assert result == (datetime.now() + timedelta(days=1)).date()
```

### Frontend Tests
```tsx
// __tests__/ChatWidget.test.tsx
test('sends message and displays response', async () => {
  render(<ChatWidget />);

  const input = screen.getByPlaceholder('Type a message...');
  fireEvent.change(input, { target: { value: 'Show tasks' } });
  fireEvent.click(screen.getByText('Send'));

  await waitFor(() => {
    expect(screen.getByText(/You have \d+ tasks/)).toBeInTheDocument();
  });
});
```

## Performance Considerations

1. **API Response Time**: Cache common queries, use streaming for long responses
2. **Database**: Index on `user_id` and `created_at` columns
3. **Frontend**: Lazy load chat widget, virtualize long message lists
4. **Rate Limiting**: Prevent API abuse with per-user limits

## Cost Estimation (100 Active Users)

**OpenAI API (GPT-4o-mini):**
- Input: $0.15 / 1M tokens
- Output: $0.60 / 1M tokens
- Average request: 200 tokens input + 100 tokens output
- 100 users × 20 messages/day = 2000 requests/day
- Cost: ~$3-5/month

**Infrastructure:**
- Same as Phase II (no additional server costs)

**Total: ~$5/month**

## Security Checklist

- [ ] API keys in environment variables (not committed)
- [ ] Rate limiting on chat endpoints
- [ ] Input sanitization (prevent prompt injection)
- [ ] User authentication required for all endpoints
- [ ] CORS configured properly
- [ ] SQL injection protection (SQLModel handles this)
- [ ] XSS protection in chat messages

## Rollout Plan

1. **Week 1**: Backend AI + Basic chat (no UI)
2. **Week 2**: Chat UI + Voice commands
3. **Week 3**: Smart suggestions
4. **Week 4**: Testing + Polish
5. **Week 5**: Soft launch (beta users)
6. **Week 6**: Full release

## Success Metrics

- Chat adoption rate > 40%
- Voice usage > 15%
- Suggestion acceptance > 30%
- Average response time < 2s
- User satisfaction > 4/5 stars

## Rollback Strategy

If issues arise:
1. Disable chat via feature flag (`ENABLE_AI_CHAT=false`)
2. Phase II continues working normally
3. Fix issues on separate branch
4. Re-enable after testing

---

**Ready to start implementation!** 🚀
