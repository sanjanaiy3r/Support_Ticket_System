## Support Ticket System

Tech Intern Assessment – Full Stack Application

Overview

This project is a full-stack Support Ticket System that allows users to submit, manage, and analyze support tickets.

The key differentiator is the integration of an LLM-based auto-classification system, which suggests ticket category and priority before submission.

The application is fully containerized and runs using a single Docker command.

Tech Stack

Backend

Django

Django REST Framework

PostgreSQL

Frontend

React (Vite)

LLM Integration

Google Gemini API

Infrastructure

Docker

Docker Compose

Core Features
Ticket Management

Create support tickets

Auto-suggest category and priority via LLM

Manually override LLM suggestions

Update ticket status (open → in_progress → resolved → closed)

Search by title and description

Filter by category, priority, and status

Statistics Dashboard

Total tickets

Open tickets

Average tickets per day (last 30 days)

Priority breakdown

Category breakdown

Uses database-level aggregation (Django ORM annotate/aggregate)

LLM Integration

/api/tickets/classify/ endpoint

Accepts ticket description

Returns suggested category and priority

Strict JSON response format

Graceful fallback if API fails

API key managed via environment variable

Running the Application
1️⃣ Add API Key

Create a .env file in the project root:

GEMINI_API_KEY=your_api_key_here

2️⃣ Start the Application

From the root directory:

docker compose up --build

3️⃣ Access the App

Frontend:

http://localhost:5173


Backend API:

http://localhost:8000/api/tickets/

API Endpoints
Method	Endpoint	Description
POST	/api/tickets/	Create a ticket
GET	/api/tickets/	List tickets (supports filters & search)
PATCH	/api/tickets/<id>/	Update ticket
GET	/api/tickets/stats/	Get aggregated metrics
POST	/api/tickets/classify/	Get LLM suggestions
Design Decisions

Enforced field constraints at the database level

Used ORM aggregation for efficient statistics

Implemented strict LLM prompt formatting

Added graceful failure handling for LLM service

Fully containerized architecture

Environment variables for sensitive configuration

Evaluation Coverage

End-to-end functionality with docker compose up --build

Working LLM classification flow

Clean REST API design

Database-level aggregation

Dockerized PostgreSQL + Backend + Frontend

Structured and readable codebase
