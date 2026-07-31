# System Design

## High-Level Architecture

Browser
↓
Next.js Frontend
↓
Express.js Backend
↓
PostgreSQL + Cloudinary + OpenAI API + Email Service

## Frontend

- Next.js App Router
- React
- Tailwind CSS
- Shadcn UI

## Backend

- Express.js
- Prisma ORM
- PostgreSQL

## Authentication

- JWT
- Google OAuth (later)

## AI

- Resume Analysis
- Resume Score
- Interview Questions

## File Storage

- Cloudinary
- Store URL in PostgreSQL

## Deployment

- Frontend: Vercel
- Backend: Railway
- Database: Railway PostgreSQL
- AI: OpenAI API
- Files: Cloudinary

## Security

- JWT Authentication
- bcrypt
- Helmet
- CORS
- Rate Limiting
- Input Validation