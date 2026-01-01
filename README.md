# Hotel Todo App - Complete 3-Phase Implementation

A production-ready todo application evolving through three phases: from console CLI to full-stack web app to AI-powered chatbot interface.

## 📋 Project Overview

This project demonstrates progressive feature development across three distinct phases:

- **Phase I**: Python CLI Console Application
- **Phase II**: Full-Stack Multi-User Web Application
- **Phase III**: AI-Powered Chatbot with Voice Commands

---

## 🎯 Phase I: Console CLI Todo App

### Features
1. Add task with title and description
2. View all tasks with status
3. Update task by ID
4. Delete task by ID
5. Mark task complete/incomplete

### Technology Stack
- Python 3.13+
- Rich library for terminal UI
- JSON file storage

### Quick Start

```bash
# Navigate to CLI code
cd src/

# Install dependencies
pip install rich

# Run the app
python main.py
```

### Project Structure
```
src/
├── main.py              # CLI entry point
├── models/              # Task data model
├── services/            # Business logic
├── ui/                  # Terminal UI components
└── utils/               # Helper functions
```

---

## 🌐 Phase II: Full-Stack Web Application

### Features
1. **User Authentication** - Register, login, logout with JWT tokens
2. **Create Tasks** - Add tasks with title and optional description
3. **View Tasks** - See all your tasks sorted by creation time
4. **Update Tasks** - Edit task title and description
5. **Delete Tasks** - Remove tasks permanently
6. **Toggle Status** - Mark tasks as complete or incomplete
7. **Multi-User Support** - Each user sees only their own tasks

### Technology Stack
- **Backend**: Python 3.13+, FastAPI, SQLModel, Alembic, PostgreSQL
- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Database**: PostgreSQL 15+ (Neon cloud or Docker local)
- **Development**: UV (Python), npm/pnpm (Node.js)

### Prerequisites

- Python 3.13+ (`python --version`)
- UV package manager (`curl -LsSf https://astral.sh/uv/install.sh | sh`)
- Node.js 18+ (`node --version`)
- npm or pnpm (`npm --version`)
- Docker Desktop (optional, for local PostgreSQL)

### Setup Instructions

#### 1. Database Setup

```bash
# Option A: Use Neon (cloud PostgreSQL)
# 1. Sign up at https://neon.tech
# 2. Create database and copy connection string

# Option B: Use Docker (local PostgreSQL)
cd docker
docker-compose up -d postgres
# Connection: postgresql+asyncpg://todo_user:todo_password@localhost:5432/todo_db
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
uv sync

# Create .env file
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET_KEY

# Run migrations
uv run alembic upgrade head

# Start backend server
uv run uvicorn src.main:app --reload --port 8000
```

**Backend running at**: http://localhost:8000
**API docs at**: http://localhost:8000/docs

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or: pnpm install

# Create .env.local
cp .env.local.example .env.local
# Edit with NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
# or: pnpm dev
```

**Frontend running at**: http://localhost:3000

### Project Structure

```
├── backend/
│   ├── src/
│   │   ├── models/          # SQLModel entities (User, Task, Chat)
│   │   ├── services/        # Business logic + AI service
│   │   ├── api/             # FastAPI routes
│   │   ├── core/            # Configuration & security
│   │   ├── db/              # Database setup
│   │   └── main.py          # FastAPI app
│   ├── alembic/             # Database migrations
│   ├── tests/               # Backend tests
│   └── pyproject.toml       # UV dependencies
│
├── frontend/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Landing page
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   └── dashboard/       # Task dashboard with AI chat
│   ├── components/          # React components
│   │   └── ChatWidget.tsx   # AI chatbot component
│   ├── lib/                 # API client & utilities
│   └── types/               # TypeScript types
│
├── src/                     # Phase I CLI code
│
├── shared/
│   └── types/               # Shared TS type definitions
│
└── docker/
    └── docker-compose.yml   # Local development stack
```

---

## 🤖 Phase III: AI-Powered Chatbot

### Features
1. **AI Chatbot Interface** - Natural language task management
2. **Voice Commands** - Hands-free task creation (browser speech API)
3. **Smart Suggestions** - AI-powered task insights
4. **Dark/Light Mode** - Complete theme system with ultra-dark blue design
5. **Responsive Design** - Mobile-first with beautiful UI
6. **Chat History** - Persistent conversation history per user

### AI Capabilities

- **Natural Language Processing**: "Add a task to buy groceries tomorrow"
- **Voice Input**: Click microphone and speak your command
- **Smart Parsing**: Extracts task details from conversational text
- **Context Awareness**: Understands task references like "mark it complete"
- **Helpful Responses**: Friendly, informative feedback

### Technology Stack (Additional)
- **AI**: Hugging Face Inference API (Qwen/Qwen2.5-72B-Instruct)
- **Speech**: Browser Web Speech API
- **Animation**: Framer Motion for smooth transitions
- **UI**: Dark theme with blue accent colors

### Additional Setup for Phase III

#### Backend AI Configuration

```bash
# Add to backend/.env
HUGGINGFACE_API_KEY=your_huggingface_api_key
AI_MODEL=Qwen/Qwen2.5-72B-Instruct
```

Get your Hugging Face API key at: https://huggingface.co/settings/tokens

#### Features in Dashboard

1. **Chat Widget**: Bottom-right floating chat button
2. **Voice Input**: Microphone icon in chat input
3. **Theme Toggle**: Top-right corner theme switcher
4. **Smart Commands**:
   - "Add task: Call dentist tomorrow"
   - "Show my tasks"
   - "Mark task 5 as complete"
   - "Delete all completed tasks"
   - "What should I focus on today?"

### Database Schema (Phase III additions)

```sql
-- Chat messages table
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    is_user BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
uv run pytest tests/ -v
```

### Frontend Tests

```bash
cd frontend
npm run test
```

### Manual Testing

1. Register a new user
2. Create several tasks
3. Open chat widget
4. Try voice input: "Add task to review documentation"
5. Ask: "Show my incomplete tasks"
6. Toggle between light/dark mode

---

## 📝 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname

# JWT Authentication
JWT_SECRET_KEY=your-super-secret-key-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# AI (Phase III)
HUGGINGFACE_API_KEY=your_huggingface_api_key
AI_MODEL=Qwen/Qwen2.5-72B-Instruct
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🐳 Docker Development

```bash
cd docker
docker-compose up -d

# Services:
# - PostgreSQL: localhost:5432
# - Backend API: localhost:8000
# - Frontend: localhost:3000
```

---

## 📚 Documentation

### Phase I (CLI)
- Console implementation in `src/`

### Phase II (Web App)
- **Specification**: `specs/001-web-todo-app/spec.md`
- **Implementation Plan**: `specs/001-web-todo-app/plan.md`
- **Task Breakdown**: `specs/001-web-todo-app/tasks.md`
- **API Contracts**: `specs/001-web-todo-app/contracts/api-endpoints.md`
- **Data Model**: `specs/001-web-todo-app/data-model.md`
- **Quickstart Guide**: `specs/001-web-todo-app/quickstart.md`

### Phase III (AI Chatbot)
- **Specification**: `specs/002-ai-chatbot/spec.md`
- **Implementation Plan**: `specs/002-ai-chatbot/plan.md`
- **AI Service**: `backend/src/services/ai_service.py`
- **Chat Widget**: `frontend/components/ChatWidget.tsx`

---

## 🔐 Security

- **Passwords**: Hashed with bcrypt (cost factor 12)
- **JWT Tokens**: 7-day expiry, secure HTTP-only cookies
- **User Isolation**: Each user sees only their own tasks and chat history
- **CORS**: Configured for allowed origins only
- **API Keys**: Stored in environment variables, never committed
- **Input Validation**: All user inputs validated and sanitized

---

## 🎨 UI/UX Features

- **Responsive Design**: Mobile 320px to desktop 1920px+
- **Dark/Light Theme**: Complete theme system with persistence
- **Ultra-Dark Mode**: Pure black backgrounds with dark blue accents
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback
- **Smooth Animations**: Framer Motion transitions
- **Voice Feedback**: Visual indicators during speech recognition
- **Accessibility**: Keyboard navigation, ARIA labels

---

## 🚢 Deployment

### Recommended Platforms

- **Frontend**: Vercel, Netlify
- **Backend**: Fly.io, Railway, Render
- **Database**: Neon (serverless PostgreSQL), Railway

### Quick Deploy

```bash
# Frontend (Vercel)
cd frontend
vercel --prod

# Backend (Railway)
cd backend
railway up
```

---

## 🌟 Features by Phase

| Feature | Phase I | Phase II | Phase III |
|---------|---------|----------|-----------|
| Add Tasks | ✅ CLI | ✅ Web UI | ✅ Chat/Voice |
| View Tasks | ✅ Terminal | ✅ Dashboard | ✅ AI Summary |
| Update Tasks | ✅ By ID | ✅ Edit Form | ✅ Natural Language |
| Delete Tasks | ✅ By ID | ✅ Click Button | ✅ Voice Command |
| Status Toggle | ✅ CLI | ✅ Checkbox | ✅ "Mark complete" |
| Authentication | ❌ | ✅ JWT | ✅ JWT |
| Multi-User | ❌ | ✅ Isolated | ✅ Isolated |
| Persistence | File | PostgreSQL | PostgreSQL |
| AI Assistant | ❌ | ❌ | ✅ Chat + Voice |
| Smart Suggestions | ❌ | ❌ | ✅ AI-Powered |
| Dark Mode | ❌ | ❌ | ✅ Theme Toggle |

---

## 🏗️ Architecture Evolution

```
Phase I:  Terminal → JSON File
          (Single user, local storage)

Phase II: Browser → REST API → PostgreSQL
          (Multi-user, web-based)

Phase III: Browser + Voice → REST API + AI → PostgreSQL
           (Multi-user, AI-enhanced, voice-enabled)
```

---

## 📦 Git Branches

- **main**: Latest complete implementation (all phases)
- **master**: Stable production branch
- **001-web-todo-app**: Phase II full-stack web app
- **002-ai-chatbot**: Phase III AI chatbot features

---

## 👥 Contributors

- **Syeda Rohab** - Developer
- **Claude Code (Sonnet 4.5)** - AI Development Assistant

---

## 📄 License

This is an educational project demonstrating progressive feature development from CLI to AI-powered web application.

---

## 🚀 Getting Started (Fastest Path)

**Want to try Phase III (AI Chatbot)?**

```bash
# 1. Clone repository
git clone https://github.com/Syeda-Rohab/Q4-Hackathon2-Phase-3-.git
cd Q4-Hackathon2-Phase-3-

# 2. Setup database (use Neon.tech for fastest setup)

# 3. Backend
cd backend
uv sync
cp .env.example .env
# Edit .env with DATABASE_URL and HUGGINGFACE_API_KEY
uv run alembic upgrade head
uv run uvicorn src.main:app --reload --port 8000

# 4. Frontend (new terminal)
cd frontend
npm install
cp .env.local.example .env.local
npm run dev

# 5. Open http://localhost:3000
# 6. Register, login, and start chatting with your AI assistant!
```

---

**Version**: Phase III - AI-Powered Chatbot
**Status**: ✅ All Phases Complete | Production Ready
**Last Updated**: 2026-01-01
