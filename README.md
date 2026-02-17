## Support Ticket System

Tech Intern Assessment – Full Stack Application

Overview

This project is a full-stack Support Ticket System built with:

Backend: Django + Django REST Framework + PostgreSQL

Frontend: React (Vite)

LLM Integration: Google Gemini API

Infrastructure: Docker + Docker Compose

Users can:

Create support tickets

Auto-classify tickets using an LLM

Filter and search tickets

Update ticket status

View aggregated statistics

Features
Backend

Ticket model with strict DB-level constraints

Filtering by category, priority, status

Search support (?search= for title + description)

Stats endpoint using database-level aggregation

LLM classification endpoint

Graceful fallback if LLM fails

Frontend

Ticket creation form

Auto-classification before submission

Editable category & priority

Ticket list with status update

Stats dashboard

Auto-refresh after submission

LLM Integration

Uses Google Gemini

/api/tickets/classify/ endpoint

Returns suggested category and priority

Fully overrideable by user

API key via environment variable

Running the Project
1. Add your Gemini API key

Create a .env file in the root folder:

GEMINI_API_KEY=your_api_key_here

2. Run with Docker
docker compose up --build

Access:

Frontend:

http://localhost:5173


Backend API:

http://localhost:8000/api/tickets/

API Endpoints

POST /api/tickets/

GET /api/tickets/

PATCH /api/tickets/<id>/

GET /api/tickets/stats/

POST /api/tickets/classify/

Design Decisions

Used database-level aggregation for stats

LLM prompt enforces strict JSON output

Graceful fallback if LLM fails

Dockerized full stack with PostgreSQL

Evaluation Criteria Covered

Fully working with docker compose up --build

LLM integration

DB-level aggregation

Clean API design

Containerized infrastructure

Proper environment variable usage
