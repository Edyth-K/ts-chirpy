# Chirpy

A RESTful social network API built with TypeScript and Express.js. Users can post short messages ("chirps"), follow each other, and authenticate securely — all backed by a PostgreSQL database.

## Features

- REST API with full JSON request/response handling
- User authentication and authorization with JWTs
- PostgreSQL database with migrations
- Webhook support
- Static file serving

## Tech Stack

- **Runtime:** Node.js 22.14.0
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL

## Getting Started

### Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) (recommended)
- PostgreSQL

### Setup

```bash
nvm use
npm install
```

Configure your environment variables (database connection, JWT secret, etc.) in a `.env` file, then run:

```bash
npm run dev
```

## API Overview

| Resource | Description |
|----------|-------------|
| `POST /api/users` | Register a new user |
| `POST /api/login` | Authenticate and receive a JWT |
| `GET /api/chirps` | List all chirps |
| `POST /api/chirps` | Post a new chirp |

> Full API documentation available once the server is running.

## Course

Built as part of the [Boot.dev](https://www.boot.dev) Learn HTTP Servers course.
