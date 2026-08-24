# BrownEvents — Brownfield Task Route

> *"All our events are brown as s... stale coffee"*
>
> Read this document before starting any task. Set up the project with
> `docker-compose up` and explore it before picking up a task.
>
> **This is a trimmed, ordered route in two tracks — .NET and TypeScript**
> (the full task library is larger). Pick your track, then work through its tasks
> **in order** — each task builds on the ones before it.
> The rules of the pilot (branches, PRs, process, report) are in [ASSIGNMENT.md](ASSIGNMENT.md).
>
> **Two task numberings.** `BEVN-xxx` tasks are taken **verbatim** from the original
> BrownEvents task library — don't be surprised by gaps in the numbers. `EXT-xxx` tasks
> were added for this pilot. Where a pilot-specific requirement extends an original task,
> it appears as a marked **"Pilot addition"** block — the original text above it is untouched.

---

## Table of Contents

- [What You're Working With](#what-youre-working-with)
- [Domain Entities](#domain-entities)
- [The Route](#the-route)
- [Tasks](#tasks)
  - [Phase 0 — Discovery (both tracks)](#phase-0--discovery-both-tracks)
  - [CI Revival (both tracks)](#ci-revival-both-tracks)
  - [Phase 1A — Stabilize the Registration Flow (Track A)](#phase-1a--stabilize-the-registration-flow-track-a)
  - [Optional — SQL Performance (both tracks)](#optional--sql-performance-both-tracks)
  - [Phase 1B — Migrate to TypeScript (Track B)](#phase-1b--migrate-to-typescript-track-b)
  - [Frontend Fix (both tracks)](#frontend-fix-both-tracks)
  - [Phase 2 — New Features (both tracks)](#phase-2--new-features-both-tracks)
  - [E2E Testing (both tracks)](#e2e-testing-both-tracks)

---

## What You're Working With

BrownEvents is a conference management application built two years ago by a team that has since moved on. The app works — conferences can be created, sessions are listed, attendees can register. The codebase, however, has not been maintained. Your job is to explore it, understand it, and improve it.

The stack is **ASP.NET Core 6 + EF Core 6 + React + Vite + PostgreSQL**. Run `docker-compose up` to get a working environment before starting any task.

> **Important:** Phase 0 tasks are prerequisites. Complete them before Phase 1 so you have a map of the codebase and a list of its problems.

---

## Domain Entities

| Entity | Key Fields |
|--------|-----------|
| **Conference** | Id, Title, Description, Location, StartDate, EndDate, Status |
| **Session** | Id, Title, Description, StartTime, EndTime, Capacity, ConferenceId, SpeakerId, RoomId |
| **Speaker** | Id, FirstName, LastName, Bio, Email |
| **Room** | Id, Name, Capacity, Location |
| **Attendee** | Id, FirstName, LastName, Email |
| **Registration** | Id, ConferenceId, AttendeeId, RegisteredAt, Status |

---

## The Route

You work **individually**, tasks strictly in order. There are **two tracks** — pick one based on the backend stack you know well (you must be able to judge the agent's output, not just apply it):

**Track A — .NET.** Stabilize the existing backend, then build features on it.

| # | Task | Theme | Process |
|---|------|-------|---------|
| 1 | BEVN-001 | Codebase mapping | free-form |
| 2 | BEVN-002 | API documentation | free-form |
| 3 | BEVN-003 | Technical debt audit | free-form |
| 4 | EXT-110 | Revive CI on GitHub Actions | free-form |
| 5 | BEVN-104 | Standardize API responses and errors | free-form |
| 6 | BEVN-107 | Add input validation | free-form |
| 7 | BEVN-109 | Fix transaction boundaries | free-form |
| — | BEVN-101 | *Optional:* Sessions page is slow (N+1) | free-form |
| 8 | BEVN-115 | Registration modal stale state | free-form |
| 9 | BEVN-202 | Session Waitlist | **spec-driven (superpowers)** |
| 10 | BEVN-203 | Attendee Registration Dashboard | **spec-driven (superpowers)** |
| 11 | BEVN-205 | End-to-end test suite (Playwright) | **spec-driven (superpowers)** |

**Track B — TypeScript.** Same discovery and CI work, then migrate the backend to TypeScript instead of stabilizing the .NET one — fixing its known defects in the process — and build the same features on the migrated backend.

| # | Task | Theme | Process |
|---|------|-------|---------|
| 1 | BEVN-001 | Codebase mapping | free-form |
| 2 | BEVN-002 | API documentation | free-form |
| 3 | BEVN-003 | Technical debt audit | free-form |
| 4 | EXT-110 | Revive CI on GitHub Actions | free-form |
| — | BEVN-101 | *Optional:* Sessions page is slow (N+1) — do it **before** the migration | free-form |
| 5 | EXT-150 | Migrate backend to TypeScript (NestJS) | **spec-driven (superpowers)** |
| 6 | BEVN-115 | Registration modal stale state | free-form |
| 7 | BEVN-202 | Session Waitlist | **spec-driven (superpowers)** |
| 8 | BEVN-203 | Attendee Registration Dashboard | **spec-driven (superpowers)** |
| 9 | BEVN-205 | End-to-end test suite (Playwright) | **spec-driven (superpowers)** |

Both routes are one vertical slice: understand the codebase (Phase 0), revive CI (EXT-110), get the registration flow into shape (Phase 1: fix it in place, or migrate it cleanly), build two features on top of it (Phase 2), and finish by covering the flows with e2e tests (BEVN-205). Skipping ahead makes later tasks harder — the Phase 2 features rely on clean error handling, validation and atomic writes, whichever way you got them, and the e2e suite tests what you built.

"Free-form" means: work with your agent however you like. "Spec-driven" means: spec and plan are written and reviewed **before** the code — see [ASSIGNMENT.md](ASSIGNMENT.md).

---

## Tasks

---

## Phase 0 — Discovery (both tracks)

> Goal: understand the codebase well enough to work in it safely. Output is documentation, not code. These three tasks are identical for both tracks — discovery doesn't depend on the stack you'll continue in.

### BEVN-001 — Codebase Mapping
Explore the backend codebase and produce a written map of what exists. Document the project structure, the responsibility of each layer (Controllers, Services, Models, Data), and the relationships between entities. Draw an entity-relationship diagram. Identify the request flow from HTTP call to database and back. At the end, a new team member should be able to understand the architecture from your document without reading the code.

**Definition of Done:**
- [ ] Entity-relationship diagram created (any format: draw.io, Mermaid, plain ASCII)
- [ ] Layer responsibility table written: Controllers, Services, Models/Data mapped to their roles
- [ ] Request flow documented for at least 3 endpoints end-to-end
- [ ] Saved as `docs/architecture.md` in the project root

---

### BEVN-002 — API Documentation
The API has no documentation. Add Swagger/OpenAPI so the API is self-describing and explorable without reading the source code. Ensure every endpoint has a description, shows its request/response schema, and is testable from the Swagger UI.

**Definition of Done:**
- [ ] All existing endpoints are documented and browsable via Swagger UI at `/swagger`
- [ ] Each endpoint shows its expected inputs, possible responses, and at least one example request body
- [ ] A frontend developer can build against the API using only the Swagger UI
- [ ] No endpoint is missing from the documentation

---

### BEVN-003 — Technical Debt Audit
Read the codebase thoroughly — both backend and frontend — and produce a structured audit document listing every quality issue you find. Each issue should be actionable: a reader should know exactly where to look and what to change. Group issues by category and assign severity. The output of this task feeds directly into the Phase 1 stabilization work.

**Definition of Done:**
- [ ] Both backend and frontend covered in the audit
- [ ] Each issue has: location (file + line where relevant), description, severity (High / Medium / Low), suggested fix
- [ ] Issues grouped by category (e.g. performance, correctness, security, maintainability, configuration)
- [ ] At least 10 distinct issues documented (there are more than 10 intentional ones — find them)
- [ ] Saved as `docs/tech-debt-audit.md` in the project root

> **Pilot addition:** the audit must explicitly cover at least these three areas — blocking
> calls on async code, query efficiency (how the ORM actually loads related data), and CORS
> configuration. If you find nothing wrong in one of them, say so and explain why.

---

## CI Revival (both tracks)

> A small piece of real legacy work: the project's CI config is from a platform this
> repository no longer lives on. Free-form process.

### EXT-110 — Revive CI on GitHub Actions
The repository contains `.gitlab-ci.yml` — a CI pipeline from the platform the project used to live on. On GitHub it is dead weight: GitHub never executes it, so pull requests get no builds and no test runs. Figure out what the old pipeline did, and bring CI back to life on GitHub Actions. The docker-publish jobs are not needed (there is no registry to push to) — port only what earns its keep.

**Definition of Done:**
- [ ] PR description summarizes what the old GitLab pipeline did, job by job, and what was ported vs dropped (and why)
- [ ] `.github/workflows/ci.yml` exists and runs on every pull request and on pushes to `main`
- [ ] Backend job: restore, build, and run unit tests
- [ ] Frontend job: install and build
- [ ] The workflow is green on this task's own PR
- [ ] `.gitlab-ci.yml` is removed — dead config confuses the next reader

---

## Phase 1A — Stabilize the Registration Flow (Track A)

> Track A only. Build from plain requirements — no spec-driven flow required. These three fixes prepare the ground for the Phase 2 features.

### BEVN-104 — Standardize API Responses and Error Handling
The frontend team keeps running into surprises when consuming the API — different endpoints return data in different shapes, and when something breaks, the full ASP.NET error page (or raw stack trace) comes back. Fix this so the API is predictable for any caller.

**Definition of Done:**
- [ ] All endpoints return responses in the same structure — no surprises per endpoint
- [ ] `POST` endpoints return `201 Created` with the created resource, not `200 OK`
- [ ] Error responses are structured JSON with a message, never an HTML page or raw stack trace
- [ ] Common failure scenarios (not found, bad input, unexpected errors) return appropriate HTTP status codes
- [ ] At least one existing unit test updated to reflect the new response shape

---

### BEVN-107 — Add Input Validation
The API accepts any payload without validation. Submitting a registration with an empty email, creating a conference with no title, or sending a completely empty JSON body all either silently succeed or produce an unhelpful 500. Add proper input validation so the API rejects invalid input with a clear error message before it reaches the service layer.

**Definition of Done:**
- [ ] Relevant model properties annotated with `[Required]`, `[MaxLength]`, `[EmailAddress]` where appropriate
- [ ] Controllers annotated with `[ApiController]` so `ModelState` is checked automatically
- [ ] Invalid input returns `400 Bad Request` with a structured message listing which fields failed and why
- [ ] At least two unit or integration tests covering validation failure scenarios

---

### BEVN-109 — Fix Transaction Boundaries in Multi-Step Writes
The registration flow saves an attendee and then saves a registration in two separate `SaveChangesAsync` calls with no transaction. If anything fails between the two saves, the database is left in an inconsistent state — an attendee row with no matching registration. Find all multi-step write operations and make them atomic.

**Definition of Done:**
- [ ] Multi-step write operations are wrapped in a transaction
- [ ] A brief comment in each transactional method explains what state would be corrupted without the transaction
- [ ] Existing unit tests still pass

---

## Optional — SQL Performance (both tracks)

> Optional on both tracks, and strongly encouraged: query performance is one of the most
> valued skills on real projects. On Track A do it any time after EXT-110; on Track B do it
> **before** EXT-150 — it will be your one chance to change live C# code, and what you learn
> feeds straight into the migration.

### BEVN-101 — Sessions Page Is Slow
Users are complaining that opening a conference page takes noticeably longer when the conference has many sessions. No errors, the data loads — it's just slow. Find out why and fix it. The data returned must stay the same.

**Definition of Done:**
- [ ] Root cause identified and documented in a code comment at the fix location
- [ ] Fix applied to all affected service methods
- [ ] The number of SQL queries executed for the sessions endpoint is bounded regardless of session count
- [ ] No existing endpoint returns different data than before
- [ ] PR description explains what was happening and what changed

---

## Phase 1B — Migrate to TypeScript (Track B)

> Track B only, replaces Phase 1A. **Spec-driven flow is mandatory:** a migration without a plan burns days — write the spec and plan first (see [ASSIGNMENT.md](ASSIGNMENT.md)).

### EXT-150 — Migrate the Backend to TypeScript (NestJS)
The team is consolidating on a TypeScript stack. Reimplement the backend in **TypeScript with NestJS and Prisma** (PostgreSQL stays), preserving the existing API surface so the React frontend keeps working unchanged. This is a *clean* migration: the defects you documented in BEVN-003 must be **fixed in the new backend, not ported**. NestJS maps almost one-to-one onto the ASP.NET Core structure — controllers, services, DI — so use the existing code as the source of truth for behavior, not as a style guide.

**Definition of Done:**
- [ ] Backend reimplemented in TypeScript: NestJS + Prisma, PostgreSQL unchanged
- [ ] Same API surface: every existing endpoint keeps its path, method and response data — the frontend works against the new backend without changes
- [ ] Demo data seeding preserved (equivalent of `DataSeeder`)
- [ ] All endpoints return responses in the same structure; errors are structured JSON with appropriate status codes — never a raw stack trace
- [ ] `POST` endpoints return `201 Created` with the created resource
- [ ] Input validated with `class-validator` + `ValidationPipe`; invalid input returns `400 Bad Request` listing which fields failed and why
- [ ] Multi-step writes are atomic (`$transaction`), with a brief comment explaining what state would be corrupted otherwise
- [ ] Defects from your BEVN-003 audit are fixed, not ported — the PR description lists each one and how the new code avoids it
- [ ] Existing backend unit tests ported to the new stack (Jest or Vitest) and passing
- [ ] API documentation from BEVN-002 survives the migration (e.g. `@nestjs/swagger`) — `/swagger` works on the new backend
- [ ] No N+1 queries: list endpoints execute a bounded number of queries regardless of record count
- [ ] The CI workflow from EXT-110 is updated to build and test the new backend
- [ ] `docker-compose up --build` brings up the app with the new backend; README updated with new run instructions

---

## Frontend Fix (both tracks)

> The frontend is React on both tracks — this task is identical for everyone. Free-form process.

### BEVN-115 — Registration Modal Shows Stale Data After Close
When a user opens the registration modal, partially fills in the form, and then closes it, the fields still contain the old data the next time the modal is opened. After a successful registration, reopening the modal shows the success screen instead of a fresh form — making it impossible to start a new registration without refreshing the page.

**Definition of Done:**
- [ ] Closing the modal resets all form fields to empty
- [ ] Closing the modal clears any validation errors and server error messages
- [ ] After a successful registration, reopening the modal presents a fresh empty form
- [ ] Multiple open/close cycles do not accumulate state

---

## Phase 2 — New Features (both tracks)

> Track A builds these on the stabilized .NET backend; Track B builds them on the migrated TypeScript backend. The requirements are identical. **Spec-driven flow is mandatory here.** Before writing any code: produce a spec (what exactly will be built, edge cases resolved) and a plan (how, step by step), review them yourself, and commit both alongside the code in the PR. Recommended tooling: the [superpowers](https://github.com/obra/superpowers) workflow (brainstorming → spec → plan → implementation). Details in [ASSIGNMENT.md](ASSIGNMENT.md).

### BEVN-202 — Session Waitlist
When a session has reached its capacity, an attendee can join a waitlist. If a registered attendee cancels, the first person on the waitlist is automatically promoted to a confirmed registration. This promotion should be logged. The session detail page shows current registration count, capacity, and waitlist count.

**Definition of Done:**
- [ ] `POST /api/sessions/{id}/waitlist` adds an attendee to the waitlist
- [ ] Registering for a session at capacity returns 409 — does not auto-waitlist
- [ ] Cancelling a confirmed registration triggers automatic promotion of the next waitlisted attendee
- [ ] Promotion is logged at INFO level with attendee ID and session ID
- [ ] `GET /api/sessions/{id}` response includes `registeredCount`, `capacity`, `waitlistCount`
- [ ] Session detail page shows capacity and waitlist count
- [ ] Unit tests cover: join waitlist, cancel triggers promotion, waitlist ordering

---

### BEVN-203 — Attendee Registration Dashboard
An attendee can view all their conference registrations in one place. The dashboard shows each registration with conference name, dates, status, and a cancel button. Cancellation triggers the same waitlist promotion logic as BEVN-202.

**Definition of Done:**
- [ ] `GET /api/attendees/{email}/registrations` returns all registrations with conference context
- [ ] Dashboard page accessible at `/dashboard` with an email input to look up registrations
- [ ] Each registration shows conference name, dates, status
- [ ] Confirmed registrations have a cancel button; cancelled ones are read-only
- [ ] Cancellation refreshes the list
- [ ] Empty state shown when no registrations found for the email

---

## E2E Testing (both tracks)

> The final task of the route: cover the critical user flows — including the features you
> just built — with end-to-end tests. Spec-driven process.

### BEVN-205 — End-to-End Test Suite
Cover the three critical user flows with end-to-end tests using Playwright. Tests run against the live `docker-compose` stack — no mocked API responses for happy-path scenarios. The suite is integrated into the GitLab CI pipeline and blocks merging on failure.

**Definition of Done:**
- [ ] Playwright configured in `frontend/` or a dedicated `e2e/` folder
- [ ] Flow 1: Browse conferences → open detail → view sessions
- [ ] Flow 2: Open session detail → register attendee → verify registration appears
- [ ] Flow 3: Open conference search → apply keyword filter → verify results update
- [ ] Each flow includes at least one failure case (e.g. register with empty email, search with no results)
- [ ] Tests pass against `docker-compose up` stack
- [ ] `.gitlab-ci.yml` has an `e2e` job in the `test` stage that starts the stack and runs Playwright
- [ ] Failed test screenshots saved as GitLab CI artifacts

> **Pilot addition:** two DoD items above are remapped to this pilot's setup.
> Conference search (Flow 3) is not part of this route — replace Flow 3 with the waitlist
> flow you built in BEVN-202: *register attendees until the session is full → next
> registration is rejected → join the waitlist → cancel a confirmed registration → verify
> the first waitlisted attendee is promoted*. And CI here is GitHub Actions, not GitLab:
> the `e2e` job goes into your `.github/workflows/ci.yml` from EXT-110, with failed-test
> screenshots uploaded as workflow artifacts.
