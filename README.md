# Personalized Horoscope API

An Express + TypeScript backend that provides personalized daily horoscopes for users based on their zodiac sign.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/umang-sinha/personalized-horoscope.git
cd personalized-horoscope
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file at the root with the following variables:

```env
NODE_ENV=development         # or production / test
PORT=3000                    # or any other port
POSTGRES_URL=postgres://zodiac@localhost:5400/horoscope
JWT_SECRET=your-secret-key
```

### 4. Run PostgreSQL via Docker

```bash
docker-compose up -d
```

### 5. Start the Development Server (with automatic reload)

```bash
npm run dev
```

Or build and start the server without auto-reload:

```bash
npm run build && npm run start
```

### 6. View API Documentation (Swagger UI)

Once the server is running:

```
http://localhost:3000/api-docs
```

---

## Design Decisions

### Express + TypeScript

Chosen for familiarity, fast iteration, and strong type safety. The project structure is modular and scalable.

### Zod for Validation

Zod is used to validate all incoming request bodies and query parameters. It provides detailed error messages and integrates well with TypeScript.

### Sequelize ORM

Used for interacting with PostgreSQL. Sequelize offers migration support and a rich model definition syntax, with native UUID and enum support for better schema design.

### JWT for Auth

Authentication is stateless using JSON Web Tokens. Tokens contain minimal user info (`userId`) and are signed with a secret to verify authenticity on each request.

### Rate Limiting Middleware

A lightweight middleware restricts users to 5 API calls per minute based on IP.

### Zodiac Sign Calculation

The zodiac sign is derived from the user's birthdate at signup and stored in the database to avoid recalculation during each request.

### Horoscope Saving Strategy

When a user requests their horoscope for a specific date (today or in history), the system checks if an entry already exists in the database.

- If found: it returns the saved record.
- If not found: it randomly selects a horoscope from a pre-seeded list (`src/data/horoscopes.json`), stores it in the DB, and returns it.

This ensures reproducibility, improves performance, and avoids relying on any third-party APIs.

### Pino for Logging

Chosen for its performance and structured JSON output, making it production-ready and easy to integrate with tools like Datadog or Loki.

- Logs include lifecycle events such as DB authentication, model syncing, server startup, and critical errors.
- In development: all logs are shown.
- In production: `info` logs are suppressed to reduce noise.

### Unified API Response Structure + Error Codes

All API responses follow a consistent structure:

```json
{
  "success": true/false,
  "code": "ERROR_OR_SUCCESS_CODE",
  "message": "Descriptive message",
  "data": { ... }
}
```

- Domain-specific error codes (`AuthCode`, `GenericCode`, `HoroscopeCode`, etc.) improve debugging and frontend handling.
- HTTP status codes are used properly alongside custom codes for semantic clarity.

### Graceful Shutdown

The server listens for termination signals (e.g. `SIGTERM`, `SIGINT`) and closes the database connection cleanly before exiting the process.

This prevents:
- Leaving hanging DB connections
- Writing partial data during shutdown
- Unexpected crashes in production when using process managers like Docker or PM2


---

## Potential Improvements

- **Unit & Integration Tests**: Especially for authentication, input validation, and rate-limiting middleware.

- **Job Scheduler**: Add a background job to pre-fill daily horoscopes for all users using a cron task.

- **Redis Caching**: Use Redis to cache today's horoscopes per user for faster read performance, with TTL-based invalidation every day.

- **Pagination in History API**: Support pagination and limit for querying larger date ranges.

- **OpenAPI Schema Generation from Zod**: Integrate `zod-to-openapi` for automatic syncing between validation and Swagger documentation.
