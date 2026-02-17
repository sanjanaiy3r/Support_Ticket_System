# 🎫 Support Ticket System

A full-stack support ticket management app with AI-powered auto-classification. Built with Django, React, and PostgreSQL — fully containerized with Docker.

![Django](https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat&logo=googlegemini&logoColor=white)

---

## Overview

Users can submit support tickets and get instant AI suggestions for category and priority before submitting. Tickets move through a defined lifecycle, and a statistics dashboard surfaces key metrics — all computed via database-level aggregation.

---

## Features

- **AI Classification** — Gemini API suggests category and priority from the ticket description, with manual override support and graceful fallback if the service is unavailable
- **Ticket Lifecycle** — Full status management: `open → in_progress → resolved → closed`
- **Search & Filtering** — Search by title/description; filter by category, priority, and status
- **Statistics Dashboard** — Total tickets, open tickets, avg. tickets/day (last 30 days), priority and category breakdowns
- **Fully Containerized** — Postgres, Django, and React run as isolated Docker services, started with a single command

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django, Django REST Framework |
| Database | PostgreSQL |
| Frontend | React (Vite) |
| AI | Google Gemini API |
| Infrastructure | Docker, Docker Compose |

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/)
- A [Google Gemini API key](https://ai.google.dev/)

### 1. Configure environment

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
```

### 2. Build and run

```bash
docker compose up --build
```

### 3. Open the app

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000/api/tickets/ |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tickets/` | List tickets (supports filters & search) |
| `POST` | `/api/tickets/` | Create a ticket |
| `PATCH` | `/api/tickets/<id>/` | Update a ticket |
| `GET` | `/api/tickets/stats/` | Get aggregated statistics |
| `POST` | `/api/tickets/classify/` | Get AI-suggested category and priority |

### Example: Classification

```http
POST /api/tickets/classify/
Content-Type: application/json

{
  "description": "The app crashes when uploading files larger than 10MB."
}
```

```json
{
  "category": "bug",
  "priority": "high"
}
```

---

## Design Notes

- Field constraints enforced at the database level via Django ORM
- Statistics computed with `annotate`/`aggregate` — no in-memory processing
- Structured LLM prompt guarantees consistent JSON output from Gemini
- All secrets managed via environment variables — no hardcoded keys
