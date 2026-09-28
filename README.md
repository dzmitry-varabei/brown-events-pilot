# BrownEvents (.NET)

> **Тестовое задание и курс:** режимы, задания и правила сдачи — в репозитории
> [rolling-scopes-school/ai-native](https://github.com/rolling-scopes-school/ai-native/tree/main/test-task).
> Здесь — только код.

Conference management application — the .NET version of the BrownEvents brownfield reference project.

**Stack:** ASP.NET Core 6 · EF Core 6 · PostgreSQL 14 · React 18 · Vite

---

## Quick Start

```bash
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Swagger UI | http://localhost:5000/swagger |

The backend seeds demo data (3 conferences, 7 sessions, 3 speakers) on first startup.

> **macOS: port 5000 is taken by AirPlay Receiver.** If the page says *Failed to load conferences*
> and `curl -i localhost:5000/api/conferences` answers `403` with `Server: AirTunes`, that is not the
> backend — it is macOS. Turn off **System Settings → General → AirDrop & Handoff → AirPlay Receiver**
> then restart the stack (`docker-compose down && docker-compose up -d`) — the port is only
> published when the container starts. (Why the frontend depends on this port at all is worth a look during the audit.)

---

## Development Setup

### Backend

Requirements: .NET 6 SDK, PostgreSQL 14

```bash
# Start only the database
docker-compose up postgres -d

# Run the API
cd backend
dotnet run --project BrownEvents.Api

# Run tests
dotnet test BrownEvents.Tests
```

### Frontend

Requirements: Node.js 18+

```bash
cd frontend
npm install
npm run dev   # proxies /api to localhost:5000
```

---

## Tests

| Level | Where | Command |
|-------|-------|---------|
| Backend unit (xUnit, EF Core InMemory) | `backend/BrownEvents.Tests` | `cd backend && dotnet test BrownEvents.Tests` |
| Frontend component (Vitest + Testing Library) | `frontend/src/**/*.test.jsx` | `cd frontend && npm test` |
| End-to-end smoke (Playwright) | `e2e/tests` | see below |

No .NET 6 SDK installed? Run the backend tests in a container:

```bash
docker run --rm -v "$PWD/backend":/src -w /src mcr.microsoft.com/dotnet/sdk:6.0 dotnet test BrownEvents.Tests
```

The e2e smoke test runs against the live stack:

```bash
docker-compose up --build -d          # start the stack first
cd e2e
npm install
npx playwright install chromium       # once, downloads the browser
npm test
```

Set `E2E_BASE_URL` if the frontend is not on `http://localhost:5173`.

---

## Project Structure

```
backend/
  BrownEvents.Api/          ← ASP.NET Core Web API
    Controllers/            ← HTTP layer
    Services/               ← business logic
    Models/                 ← EF Core entities
    Data/                   ← DbContext + DataSeeder
  BrownEvents.Tests/        ← xUnit unit tests

frontend/
  src/
    pages/                  ← React page components
    components/             ← shared UI components
    api.js                  ← HTTP client

e2e/                        ← Playwright end-to-end tests
```
