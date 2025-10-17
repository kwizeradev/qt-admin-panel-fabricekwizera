# QT Admin Panel

A lightweight admin panel built for the assessment — featuring user CRUD, simple analytics, protobuf export, and ECDSA signature verification.

---

## Prerequisites

### Required Software:
- **Node.js:** v18.19.0 or higher (**Node.js v22 fully supported**) ([Download](https://nodejs.org/))
- **npm:** v9.0.0 or higher (comes with Node.js)
- **Git:** Latest version ([Download](https://git-scm.com/downloads))

### System Requirements:
- **OS:** macOS, Linux, or Windows 10+
- **RAM:** 4GB minimum (8GB recommended)
- **Storage:** 500MB free space
- **Network:** Internet connection for initial setup

### Quick Version Check:
```bash
node --version    # Should show v18.19.0+ (v22+ fully supported)
npm --version     # Should show v9.0.0+
git --version     # Any recent version
```

> **Note:** This project is tested and compatible with Node.js v18-v22. Uses Express v5, React 19, and `npm-run-all` for reliable cross-platform development.

### Port Requirements:
- **Port 3000** (backend API)
- **Port 5173** (frontend dev server)

Ensure these ports are available before starting.

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

```bash
npm run dev
```

### Alternative options:
```bash
# Run backend only
npm run dev:backend

# Run frontend only  
npm run dev:frontend
```

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend:** [http://localhost:3000](http://localhost:3000)

---

## Project Structure

| Folder        | Description                                    |
| ------------- | ---------------------------------------------- |
| **backend/**  | Express + TypeScript + SQLite (better-sqlite3) |
| **frontend/** | React + Vite + Tailwind                        |
| **package.json** | npm-run-all scripts for reliable concurrent execution |

---

## Design Approach

* **Single runner:** One command starts both servers using `npm-run-all` for reliable cross-platform execution.
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

## Troubleshooting

### Node.js Compatibility Issues

If you encounter issues with Node.js v22 or other versions:

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm run install:all

# For Node.js v22 specifically
npm rebuild better-sqlite3
```

### Development Server Issues

If `npm run dev` fails:

```bash
# Option 1: Run servers separately
npm run dev:backend    # Terminal 1
npm run dev:frontend   # Terminal 2

# Option 2: Check port availability
lsof -i :3000          # Backend port
lsof -i :5173          # Frontend port
```

### Common Issues:
- **Port conflicts**: Ensure ports 3000 and 5173 are available
- **Dependency issues**: Run `npm run install:all` to reinstall all dependencies
- **Node version**: This project supports Node.js v18-v22

---

## Testing

### Unit Tests (No Server Required)

```bash
# Run unit tests (crypto + protobuf)
npm --prefix backend run test:unit
```

### Smoke Test (Requires Running Server)

The smoke test runs an end-to-end check: create → export → verify → cleanup.

**⚠️ Important:** The server must be running in a separate terminal before running the smoke test.

**Step 1:** Start the server in one terminal
```bash
# Option A: Start both frontend + backend
npm run dev

# Option B: Start backend only
npm --prefix backend run dev
```

**Step 2:** In a new terminal, run the smoke test
```bash
npm --prefix backend test
```

**Step 3:** Stop the server (Ctrl+C in the first terminal) when done testing

### Custom API URL for Testing

To test against a different server:

```bash
SMOKE_API_URL=http://localhost:3001 npm --prefix backend test
```

### All Tests (Combined)

```bash
# Run unit + e2e (server must be running separately)
npm --prefix backend run test:all
```

---

## Author

**Fabrice Kwizera**
GitHub: [kwizeradev](https://github.com/kwizeradev)
