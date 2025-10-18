# QT Admin Panel

> **Please read this README carefully.** It explains the design decisions, reasoning, and choices behind the implementation — showing why features are implemented as they are, without unnecessary complexity.

A focused full-stack JavaScript assessment project — delivering all required features with deliberate simplicity and strong engineering choices.

**Features:**  
✅ User CRUD  ✅ Chart Analytics  ✅ Protocol Buffers Export  ✅ ECDSA Crypto

---

## Overview

A lightweight admin dashboard featuring:
- **User Management (CRUD)** — fast SQLite + REST API  
- **Analytics View** — users created in the last 7 days  
- **Protobuf Export** — binary serialization with ECDSA signature  
- **ECDSA P-384 Verification** — secure email signing demo  

## Screenshots

<div align="center">

<table>
  <tr>
    <td align="center" valign="top" width="50%">
      <figure>
        <img src="https://github.com/user-attachments/assets/96d8434e-1ef1-45ec-8840-1587f72957c9" alt="Dashboard Overview" width="520" style="max-width:100%; height:auto; border-radius:6px;">
        <figcaption style="font-size:12px; color:#666; margin-top:6px;">Dashboard overview — main analytics</figcaption>
      </figure>
    </td>
    <td align="center" valign="top" width="50%">
      <figure>
        <img src="https://github.com/user-attachments/assets/91fd69fd-c6d2-47c2-be0b-9ab4f0997dff" alt="Create User Modal" width="520" style="max-width:100%; height:auto; border-radius:6px;">
        <figcaption style="font-size:12px; color:#666; margin-top:6px;">Create user modal — add employee record</figcaption>
      </figure>
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <figure>
        <img src="https://github.com/user-attachments/assets/aaa5361f-9235-4ced-9491-0c79f2bfb923" alt="Protobuf Export" width="520" style="max-width:100%; height:auto; border-radius:6px;">
        <figcaption style="font-size:12px; color:#666; margin-top:6px;">Protobuf export — serialized data structure</figcaption>
      </figure>
    </td>
    <td align="center" valign="top" width="50%">
      <figure>
        <img src="https://github.com/user-attachments/assets/44c92d72-1ef9-46f4-a84e-f20a6e91ab01" alt="Tests Passing" width="520" style="max-width:100%; height:auto; border-radius:6px;">
        <figcaption style="font-size:12px; color:#666; margin-top:6px;">All tests passing — backend validation</figcaption>
      </figure>
    </td>
  </tr>
</table>

</div>


---

## Quick Start

```bash
git clone https://github.com/kwizeradev/qt-admin-panel-fabricekwizera.git
cd qt-admin-panel-fabricekwizera
npm run install:all
npm run dev
```

- **Frontend:** http://localhost:5173  
- **Backend:** http://localhost:3000  

### Run Separately
```bash
npm run dev:frontend   # Frontend only
npm run dev:backend    # Backend only
```

---

## Tech Stack

| Layer | Stack |
|-------|--------|
| **Frontend** | React 19 + Vite + Tailwind |
| **Backend** | Express 5 + TypeScript + better-sqlite3 |
| **Build/Run** | npm-run-all (cross-platform) |
| **Serialization** | Protocol Buffers |
| **Crypto** | ECDSA P-384 + SHA-384 |

---

## Structure

```
qt-admin-panel-fabricekwizera/
├── backend/   # Express + TypeScript + SQLite
├── frontend/  # React + Vite + Tailwind
└── package.json  # Combined scripts
```

---

## API Summary

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/users` | List users |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| GET | `/api/users/stats` | Weekly stats |
| GET | `/api/users/export` | Export users (protobuf) |
| GET | `/api/public-key` | ECDSA public key |

**Errors:**  
400 Invalid input 404 Not found 500 Server error

---

## Design Philosophy

> **Deliver clarity, not complexity.**

| Area | Decision |
|------|-----------|
| **UI** | Tailwind only — no UI libs to stay light and consistent |
| **Backend** | Simple routes + services, no controllers (scope fit) |
| **Database** | better-sqlite3 — fast, safe, minimal overhead |
| **Docs** | In-code clarity instead of Swagger |
| **Testing** | End-to-end: create → export → verify |
| **Performance** | Tight queries, minimal re-renders |
| **Scope Control** | Focused strictly on assignment requirements; avoided test unrelated features to avoid over-engineering |

> _Purposeful restraint._

---

## Build (Production)

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build && npm run preview
```

---

## Testing

### Unit (no server)
```bash
npm --prefix backend run test:unit
```

### Smoke (requires running backend)
```bash
# 1. Run server
npm run dev

# 2. In new terminal
npm --prefix backend test
```

### All tests
```bash
npm --prefix backend run test:all
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port in use | `lsof -i :3000` or `lsof -i :5173` |
| Reinstall needed | `npm cache clean --force && npm run install:all` |
| better-sqlite3 build fail | `npm rebuild better-sqlite3` |
| Node version issues | Works on Node v18–v24 |

---

## Technical Notes

- ECDSA P-384 signing of user emails (`crypto.subtle`)
- Protobuf export served as `application/x-protobuf`
- UTC timestamps; analytics in **Africa/Kigali (UTC+02:00)**  
- `/api/users/export` uses `Cache-Control: no-store` to prevent stale downloads

---

## Author

**Fabrice Kwizera**  
GitHub: [kwizeradev](https://github.com/kwizeradev)  
📍 Kigali, Rwanda  

---

## Review Strategy

Built for the value of **clarity, scope control, and sound decisions** over bloat.

- All required features fully implemented  
- Scoped intentionally — no unnecessary extras  
- Technical completeness: crypto, protobuf, TypeScript, tests  
- One command runs the full stack  

> _“Simple where it should be, complete where it must be.”_