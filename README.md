# VedaAI - AI Assessment Creator 🎓

AI-powered Assessment Creator built with Next.js, Express, MongoDB, Redis, BullMQ, and Google Gemini AI. Teachers can create assignments, generate structured question papers using AI, view them in a clean exam-paper layout, and download as PDF.

## ✨ Features

- **Assignment Dashboard** — View, search, filter, and delete assignments
- **Create Assignment** — Upload reference material, set question types/counts/marks, add instructions
- **AI Generation** — Gemini-powered question paper generation with structured sections
- **Real-time Updates** — WebSocket notifications during generation
- **Structured Output** — Questions grouped by sections with difficulty badges (Easy/Moderate/Challenging)
- **PDF Export** — Download question papers as formatted PDFs
- **Fallback System** — Guarantees output even if AI fails
- **Mobile Responsive** — Works on all screen sizes

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────┐
│   Next.js App   │────▶│  Express API     │────▶│ MongoDB │
│   (Zustand +    │     │  (TypeScript)    │     └─────────┘
│    Socket.IO)   │     │                  │
└─────────────────┘     │  ┌────────────┐  │     ┌─────────┐
                        │  │  BullMQ    │──│────▶│  Redis  │
                        │  │  Workers   │  │     └─────────┘
                        │  └────────────┘  │
                        │  ┌────────────┐  │     ┌──────────┐
                        │  │ Gemini AI  │──│────▶│ Google   │
                        │  └────────────┘  │     │ GenAI    │
                        └──────────────────┘     └──────────┘
```

### Flow
1. Teacher creates assignment via form
2. API stores assignment in MongoDB, adds job to BullMQ queue
3. Worker processes generation using Gemini AI
4. Structured response is parsed and validated
5. Result is stored and client notified via WebSocket
6. Teacher views formatted question paper

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, TypeScript, Zustand, Socket.IO Client |
| Backend | Express.js, TypeScript |
| Database | MongoDB (Mongoose) |
| Cache | Redis (ioredis) |
| Queue | BullMQ |
| AI | Google Gemini (generative-ai) |
| PDF | Puppeteer |
| Real-time | Socket.IO |

## 🚀 Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Google Gemini API key

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

### Frontend
```bash
cd frontend
# Edit .env.local with your API URL
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## 📁 Project Structure

```
├── frontend/                # Next.js 14 App
│   ├── src/
│   │   ├── app/             # Pages (App Router)
│   │   ├── components/      # UI Components
│   │   ├── store/           # Zustand stores
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # API client
│   │   └── types/           # TypeScript types
│
├── backend/                 # Express API
│   ├── src/
│   │   ├── config/          # DB, Redis, env
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # REST routes
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # AI, PDF services
│   │   ├── queue/           # BullMQ queues & workers
│   │   ├── websocket/       # Socket.IO handler
│   │   ├── middleware/      # Error handler, upload
│   │   └── utils/           # Prompt builder
```

## 🎯 Key Design Decisions

- **Structured Prompt Engineering** — Forces AI to return valid JSON matching our schema
- **Validation + Fallback** — Parses and validates AI output; falls back to template if it fails
- **Queue-Based Processing** — BullMQ ensures async processing without blocking API
- **Redis Caching** — Cached assignment reads for faster dashboard loading
- **WebSocket Events** — Real-time progress updates during generation

## 🌐 Deployment

- **Frontend**: Deployed on Vercel - [https://ai-assessment-creator-sooty.vercel.app/](https://ai-assessment-creator-sooty.vercel.app/)
- **Backend**: Deployed on Render - [https://ai-assessment-creator-u4dy.onrender.com](https://ai-assessment-creator-u4dy.onrender.com)

## 📝 License

MIT
