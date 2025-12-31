# Phase III: AI-Powered Todo App with Chatbot & Voice

**Feature ID**: `002-ai-chatbot`
**Phase**: III
**Status**: Planning
**Priority**: High
**Created**: 2025-12-31

## Overview

Transform the Phase II todo app into an AI-powered intelligent assistant with natural language chatbot, voice commands, and smart task suggestions.

## Goals

1. **AI Chatbot Interface** - Natural language task management via chat
2. **Voice Commands** - Hands-free task creation and control
3. **Smart Suggestions** - AI-powered task recommendations and insights
4. **Seamless Integration** - Work alongside existing web UI without breaking Phase II features

## Success Criteria

- [ ] Users can create/update/delete tasks via natural language chat
- [ ] Voice input works on supported browsers (Chrome, Safari)
- [ ] AI suggests task priorities, deadlines, and groupings
- [ ] Chatbot responds in < 2 seconds
- [ ] Phase II features remain fully functional
- [ ] Mobile-responsive chat interface

## User Stories

### 1. AI Chatbot
**As a user, I want to chat with an AI assistant to manage my tasks naturally**

- User: "Add a task to buy groceries tomorrow"
- Bot: "✓ Created task 'Buy groceries' with due date tomorrow"
- User: "Show my pending tasks"
- Bot: "You have 5 pending tasks: 1. Buy groceries (due tomorrow), 2. ..."
- User: "Mark homework as complete"
- Bot: "✓ Marked 'Homework' as completed"

### 2. Voice Commands
**As a user, I want to use voice to create tasks hands-free**

- Click microphone button
- Say: "Remind me to call mom at 5 PM"
- System converts speech to text
- Bot processes and creates task

### 3. Smart Suggestions
**As a user, I want AI to help me prioritize and organize tasks**

- AI detects tasks with keywords like "urgent", "important" → suggests high priority
- AI groups similar tasks: "Buy groceries" + "Buy milk" → suggests merging
- AI suggests deadlines based on task content
- Daily summary: "You have 3 overdue tasks. Would you like to reschedule?"

## Features

### Feature 1: AI Chatbot Interface

**Frontend:**
- Chat widget (bottom-right corner) - toggleable
- Message bubbles (user vs bot)
- Typing indicator when bot is thinking
- Quick action buttons ("Show tasks", "Clear completed", etc.)
- Chat history (session-based or persistent)

**Backend:**
- New endpoint: `POST /api/chat/message`
- NLP processing using OpenAI API / Google Gemini / Local LLM
- Intent detection: create_task, list_tasks, update_task, delete_task, mark_complete
- Entity extraction: task title, description, due date, priority
- Context awareness (remember previous messages in session)

**Supported Commands:**
```
Create: "Add task: Buy milk", "Create a reminder to call John"
Read: "Show my tasks", "What's on my todo list?", "Show completed tasks"
Update: "Change task 'Buy milk' to 'Buy groceries'", "Set priority high for homework"
Delete: "Remove task 'Buy milk'", "Delete all completed tasks"
Complete: "Mark homework as done", "Complete the first task"
```

### Feature 2: Voice Commands

**Frontend:**
- Microphone button in chat interface
- Web Speech API (browser native)
- Visual feedback when listening
- Fallback: "Voice not supported in this browser"

**Backend:**
- Speech-to-text via browser API (no backend needed)
- Processed text sent to chatbot endpoint
- Response can be text-to-speech (optional)

**Supported Browsers:**
- Chrome/Edge: Full support
- Safari: Partial support
- Firefox: Limited (warn user)

### Feature 3: Smart Suggestions

**AI Features:**
- **Priority Detection**: Keywords → auto-suggest priority
  - "urgent", "asap", "important" → High
  - "later", "someday" → Low

- **Due Date Extraction**: Natural language dates
  - "tomorrow" → Date + 1 day
  - "next week" → Date + 7 days
  - "in 3 days" → Date + 3 days

- **Task Grouping**: Similar tasks → suggest categories
  - "Buy milk", "Buy bread" → Shopping category
  - "Study math", "Homework" → School category

- **Smart Reminders**: Proactive suggestions
  - "You haven't completed 'Homework' in 2 days. Mark it done?"
  - "3 tasks due today. Would you like to see them?"

- **Daily Summary**: Morning digest
  - "Good morning! You have 5 tasks today, 2 overdue."

### Feature 4: Integration with Phase II

**No Breaking Changes:**
- Existing dashboard, login, register work as-is
- Chat widget is an overlay (doesn't affect layout)
- Tasks created via chat appear in dashboard
- Tasks created via UI can be managed in chat

## Technical Architecture

### Frontend Changes

**New Components:**
```
frontend/
├── components/
│   ├── ChatWidget.tsx           # Main chat container
│   ├── ChatMessage.tsx          # Message bubble
│   ├── ChatInput.tsx            # Text + voice input
│   ├── VoiceButton.tsx          # Microphone control
│   ├── SmartSuggestions.tsx    # AI suggestion cards
│   └── TypingIndicator.tsx     # Bot typing animation
├── lib/
│   ├── chatApi.ts               # Chat API client
│   ├── voiceRecognition.ts     # Speech API wrapper
│   └── nlpHelpers.ts           # Text parsing utilities
└── hooks/
    ├── useChat.ts               # Chat state management
    └── useVoice.ts              # Voice recording hook
```

**New Pages:**
```
app/
└── dashboard/
    └── chat/                    # Chat-only view (optional)
```

### Backend Changes

**New API Endpoints:**
```python
# src/api/chat.py

POST   /api/chat/message         # Send message, get AI response
GET    /api/chat/history         # Get chat history
POST   /api/chat/suggestions     # Get AI suggestions for tasks
DELETE /api/chat/history         # Clear chat history
```

**New Services:**
```python
# src/services/ai_service.py
- process_message()              # NLP processing
- extract_intent()               # Detect user intent
- extract_entities()             # Parse task details
- generate_response()            # Create bot reply

# src/services/suggestion_service.py
- suggest_priority()             # AI priority detection
- suggest_deadline()             # Extract due dates
- group_similar_tasks()          # Find related tasks
- daily_summary()                # Generate task summary
```

**New Models:**
```python
# src/models/chat.py
class ChatMessage:
    - id, user_id, message, response, timestamp

class Suggestion:
    - id, task_id, type, content, status
```

### AI/LLM Integration

**Option 1: OpenAI API (Recommended)**
- Model: GPT-4o-mini (fast, cheap)
- Cost: ~$0.001 per request
- Setup: `OPENAI_API_KEY` in .env

**Option 2: Google Gemini**
- Model: Gemini 1.5 Flash
- Free tier: 15 requests/min
- Setup: `GOOGLE_API_KEY` in .env

**Option 3: Local LLM (Advanced)**
- Ollama + Llama 3.2
- Free, offline
- Slower response time

**Recommended: OpenAI GPT-4o-mini** for best speed/cost ratio

### Database Schema Changes

**New Tables:**
```sql
-- Chat messages
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    response TEXT,
    intent VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI suggestions
CREATE TABLE suggestions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    task_id INTEGER REFERENCES tasks(id),
    type VARCHAR(50),  -- priority, deadline, group, reminder
    content TEXT,
    status VARCHAR(20) DEFAULT 'pending',  -- pending, accepted, dismissed
    created_at TIMESTAMP DEFAULT NOW()
);
```

## UI/UX Design

### Chat Widget Layout
```
┌─────────────────────────────┐
│  Todo AI Assistant      [─][×] │
├─────────────────────────────┤
│                             │
│  Bot: How can I help?       │
│  ┌─────────────────────┐   │
│  │ Show my tasks       │   │
│  │ Add new task        │   │
│  └─────────────────────┘   │
│                             │
│  You: Add task buy milk     │
│                             │
│  Bot: ✓ Created "Buy milk"  │
│                             │
├─────────────────────────────┤
│ [🎤] Type a message...  [→] │
└─────────────────────────────┘
```

### Smart Suggestions Panel
```
┌─────────────────────────────┐
│ 💡 Smart Suggestions        │
├─────────────────────────────┤
│ ⚠️ Task "Homework" is       │
│    overdue. Reschedule?     │
│    [Snooze] [Mark Done]     │
│                             │
│ 🔥 "Buy groceries" +        │
│    "Buy milk" look similar. │
│    [Merge] [Ignore]         │
└─────────────────────────────┘
```

## Implementation Plan

### Phase 3.1: AI Chatbot (Week 1)
1. Setup OpenAI API / Gemini
2. Create chat backend endpoints
3. Build chat UI component
4. Implement basic NLP (create, list, complete tasks)
5. Test chatbot flow

### Phase 3.2: Voice Commands (Week 2)
1. Add Web Speech API integration
2. Build voice input UI
3. Connect voice → text → chatbot
4. Test on different browsers
5. Add error handling

### Phase 3.3: Smart Suggestions (Week 3)
1. Build suggestion algorithm
2. Priority detection
3. Due date extraction
4. Task grouping
5. Daily summary generation

### Phase 3.4: Polish & Testing (Week 4)
1. UI/UX improvements
2. Mobile responsiveness
3. Performance optimization
4. Integration testing
5. Documentation

## Dependencies

**Frontend:**
```json
{
  "openai": "^4.0.0",              // OpenAI API client
  "react-speech-recognition": "^3.10.0",  // Voice input
  "framer-motion": "^10.0.0"       // Animations
}
```

**Backend:**
```
openai>=1.0.0                      # OpenAI Python SDK
google-generativeai>=0.3.0         # Gemini (alternative)
spacy>=3.7.0                       # NLP (optional)
python-dateutil>=2.8.0             # Date parsing
```

## Environment Variables

```env
# AI Configuration
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini

# Or Gemini
GOOGLE_API_KEY=AIza...
GEMINI_MODEL=gemini-1.5-flash

# Feature Flags
ENABLE_VOICE=true
ENABLE_SUGGESTIONS=true
ENABLE_CHAT_HISTORY=true
```

## Security Considerations

1. **API Key Protection**: Never expose keys in frontend
2. **Rate Limiting**: Max 60 requests/min per user
3. **Input Sanitization**: Clean user messages before LLM
4. **Cost Control**: Monitor OpenAI usage, set budget alerts
5. **Privacy**: Don't send sensitive data to external APIs

## Testing Strategy

### Unit Tests
- NLP intent detection accuracy
- Entity extraction (dates, priorities)
- Voice input processing

### Integration Tests
- Chat → Task creation flow
- Voice → Chat → Task flow
- Suggestions → Task updates

### E2E Tests
- Full conversation scenarios
- Multi-turn chat context
- Voice command workflows

## Success Metrics

- **Chat Adoption**: 50%+ users try chatbot in first week
- **Voice Usage**: 20%+ users try voice commands
- **Response Time**: < 2s average bot response
- **Accuracy**: 90%+ correct intent detection
- **User Satisfaction**: 4+ star rating

## Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| High API costs | Use GPT-4o-mini, set usage limits |
| Slow LLM response | Cache common queries, use streaming |
| Voice not supported | Graceful fallback, show warning |
| Poor NLP accuracy | Fine-tune prompts, add examples |
| Phase II breaks | Extensive testing, feature flags |

## Future Enhancements (Phase 4+)

- Multi-language support (Urdu, Hindi, etc.)
- Calendar integration (Google Calendar sync)
- Collaborative tasks (assign to team members)
- Mobile app (React Native)
- Offline mode (local LLM)

## Acceptance Criteria

- [ ] User can create tasks via chat in natural language
- [ ] Voice input works and converts to text accurately
- [ ] Bot detects priorities from keywords
- [ ] Bot extracts due dates ("tomorrow", "next week")
- [ ] Suggestions appear for similar tasks
- [ ] All Phase II features work without issues
- [ ] Mobile responsive chat widget
- [ ] API costs < $5/month for 100 users

---

**Next Steps:**
1. Review and approve spec
2. Create implementation plan
3. Setup OpenAI API key
4. Begin Phase 3.1 development
