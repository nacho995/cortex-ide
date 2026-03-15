# Cortex IDE

AI-Powered Development Environment built with Java Spring Boot + Angular + Electron.

## Quick Start (Development)

```bash
./start-dev.sh
```

This starts:
- **Backend** (Java Spring Boot) on `http://localhost:8081`
- **Frontend** (Angular) on `http://localhost:4200`

## Architecture

```
cortex-ide/
├── backend/          ← Java 21 + Spring Boot (file system, git, terminal, AI proxy)
├── frontend/         ← Angular 19 + Monaco Editor (IDE UI)
└── electron/         ← Electron wrapper (desktop app)
```

## Features

- **Monaco Editor** (same as VS Code) with custom Cortex dark theme
- **File Tree** with project navigation
- **Integrated Terminal** with command execution
- **AI Chat Panel** connected to Cortex AI (Claude, Groq, Gemini)
- **Multi-agent Debate** for architecture decisions
- **Code Review** with 4 AI perspectives
- **Git Integration** with status, commit, undo
- **Keyboard Shortcuts** (Ctrl+S save, toggle panels)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.4, WebSocket |
| Frontend | Angular 19, Monaco Editor, Signals |
| Desktop | Electron |
| AI | Claude Sonnet/Opus 4, Groq, Gemini |
