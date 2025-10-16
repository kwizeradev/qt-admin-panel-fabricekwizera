# QT Admin Panel

A lightweight admin panel built for the assessment — featuring user CRUD, simple analytics, protobuf export, and ECDSA signature verification.

---

## Quick Start

### Fork the repository
```bash
git clone https://github.com/kwizeradev/qt-admin-panel-fabricekwizera.git
```

### Install dependencies for root, backend, and frontend
```bash
cd qt-admin-panel-fabricekwizera
npm run install:all
```

# Run frontend + backend together
npm run dev

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend:** [http://localhost:3000](http://localhost:3000)

---

## Project Structure

| Folder        | Description                                    |
| ------------- | ---------------------------------------------- |
| **backend/**  | Express + TypeScript + SQLite (better-sqlite3) |
| **frontend/** | React + Vite + Tailwind                        |
| **index.ts**  | Runs both apps concurrently with prefixed logs |

---

## Design Approach

* **Single runner:** One command starts both servers for a smoother dev flow.
* **Direct SQL:** Used `better-sqlite3` — simple, fast, and safe for a small schema.
* **Focused UI:** A single clean panel without routing; built for clarity, not complexity.
* **Smart scope:** Delivered the must-haves (CRUD, protobuf, crypto, stats) instead of extra tooling.
* **Lean performance:** Tight queries, fewer re-renders, smaller bundles.

---

## Key Decisions

- Styling: Tailwind CSS only. No UI library to keep the bundle small, visuals consistent, and customization straightforward.
- Backend structure: Simple routes + services (no controller layer). Clear for this size; easy to grow into controllers if needed.
- Docs: No Swagger for this scope; endpoints are documented below for quick reference.
- Persistence: No ORM or migrations yet; I would add Prisma/Drizzle when the schema grows.
- Testing: One end-to-end flow (create → export → verify) to validate the core path.
- Caching: `/api/users/export` is `no-store` to avoid stale downloads.

---

## API Overview

| Method | Endpoint            | Description                      |
| ------ | ------------------- | -------------------------------- |
| GET    | `/api/users`        | List users                       |
| POST   | `/api/users`        | Create user                      |
| PUT    | `/api/users/:id`    | Update user                      |
| DELETE | `/api/users/:id`    | Delete user                      |
| GET    | `/api/users/stats`  | Users created in the last 7 days |
| GET    | `/api/users/export` | Export users (protobuf)          |
| GET    | `/api/public-key`   | ECDSA P-384 public key           |

### Errors and status codes
- 400 Bad Request: invalid id, invalid role/status, missing required fields, duplicate email
- 404 Not Found: user not found
- 500 Internal Server Error: unexpected failures

---

## Build & Run (Production)

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build && npm run preview
```

---

## Notes

* **Security:** Uses ECDSA P-384 + SHA-384 for signing and verifying user emails.
* **Serialization:** Exports data in Protocol Buffers (`application/x-protobuf`).
* **Timezone handling:** `createdAt` stored in UTC; stats are calculated in Africa/Kigali (UTC+02:00).

---

## Example: Export Users (protobuf)

```bash
curl -sS -H "Accept: application/x-protobuf" \
  -o users.pb http://localhost:3000/api/users/export
```

---

## Smoke Test

Runs an end-to-end check: create → export → verify → cleanup.

```bash
npm --prefix backend run dev
npm --prefix backend test
```

Optional:

```bash
SMOKE_API_URL=http://localhost:3001 npm --prefix backend test
```

---

## Unit Tests

```bash
# Run unit tests (crypto + protobuf)
npm --prefix backend run test:unit

# Run unit + e2e
npm --prefix backend run test:all
```

---

## Author

**Fabrice Kwizera**
GitHub: [kwizeradev](https://github.com/kwizeradev)
