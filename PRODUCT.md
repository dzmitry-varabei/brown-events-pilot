# BrownEvents — Brownfield Task Route

> *"All our events are brown as s... stale coffee"*
>
> Read this document before starting any task. Set up the project with
> `docker-compose up` and explore it before picking up a task.
>
> **This is a trimmed, ordered route of 9 tasks** (the full task library is larger).
> Work through them **in order** — each task builds on the ones before it.
> The rules of the pilot (branches, PRs, process, report) are in [ASSIGNMENT.md](ASSIGNMENT.md).

---

## Table of Contents

- [What You're Working With](#what-youre-working-with)
- [Domain Entities](#domain-entities)
- [The Route](#the-route)
- [Tasks](#tasks)
  - [Phase 0 — Discovery](#phase-0--discovery)
  - [Phase 1 — Stabilize the Registration Flow](#phase-1--stabilize-the-registration-flow)
  - [Phase 2 — New Features](#phase-2--new-features)

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

You work **individually**, tasks strictly in order:

| # | Task | Theme | Process |
|---|------|-------|---------|
| 1 | BEVN-001 | Codebase mapping | free-form |
| 2 | BEVN-002 | API documentation | free-form |
| 3 | BEVN-003 | Technical debt audit | free-form |
| 4 | BEVN-104 | Standardize API responses and errors | free-form |
| 5 | BEVN-107 | Add input validation | free-form |
| 6 | BEVN-109 | Fix transaction boundaries | free-form |
| 7 | BEVN-115 | Registration modal stale state | free-form |
| 8 | BEVN-202 | Session Waitlist | **spec-driven (superpowers)** |
| 9 | BEVN-203 | Attendee Registration Dashboard | **spec-driven (superpowers)** |

The route is one vertical slice: understand the codebase (Phase 0), stabilize the registration flow (Phase 1), then build two features on top of it (Phase 2). Skipping ahead makes later tasks harder — the Phase 2 features rely on clean error handling (BEVN-104), validation (BEVN-107) and atomic writes (BEVN-109).

"Free-form" means: work with your agent however you like. "Spec-driven" means: spec and plan are written and reviewed **before** the code — see [ASSIGNMENT.md](ASSIGNMENT.md).

---

## Tasks

---

## Phase 0 — Discovery

> Goal: understand the codebase well enough to work in it safely. Output is documentation, not code.

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

---

## Phase 1 — Stabilize the Registration Flow

> Build from plain requirements — no spec-driven flow required. These four fixes prepare the ground for the Phase 2 features.

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

### BEVN-115 — Registration Modal Shows Stale Data After Close
When a user opens the registration modal, partially fills in the form, and then closes it, the fields still contain the old data the next time the modal is opened. After a successful registration, reopening the modal shows the success screen instead of a fresh form — making it impossible to start a new registration without refreshing the page.

**Definition of Done:**
- [ ] Closing the modal resets all form fields to empty
- [ ] Closing the modal clears any validation errors and server error messages
- [ ] After a successful registration, reopening the modal presents a fresh empty form
- [ ] Multiple open/close cycles do not accumulate state

---

## Phase 2 — New Features

> **Spec-driven flow is mandatory here.** Before writing any code: produce a spec (what exactly will be built, edge cases resolved) and a plan (how, step by step), review them yourself, and commit both alongside the code in the PR. Recommended tooling: the [superpowers](https://github.com/obra/superpowers) workflow (brainstorming → spec → plan → implementation). Details in [ASSIGNMENT.md](ASSIGNMENT.md).

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
