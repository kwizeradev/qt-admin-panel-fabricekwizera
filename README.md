# QT Admin Panel

A modern full-stack admin panel with user management, real-time analytics, and cryptographic verification. Built for QT Global Software Ltd technical assessment.

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

Visit http://localhost:5173 to view the application.

## Features

- ✅ **User Management** - Complete CRUD operations with validation
- ✅ **Real-time Dashboard** - Interactive analytics and statistics
- ✅ **7-Day Analytics** - Beautiful charts showing user creation trends
- ✅ **Protocol Buffer Export** - Binary data serialization with /users/export endpoint
- ✅ **Digital Signatures** - ECDSA P-384 cryptographic verification
- ✅ **Responsive Design** - Mobile-first UI with Tailwind CSS
- ✅ **Toast Notifications** - Professional user feedback system
- ✅ **Modal Forms** - Intuitive user creation and editing
- ✅ **Data Verification** - Only cryptographically verified users displayed

## Tech Stack

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** SQLite with Better SQLite3
- **Serialization:** Protocol Buffers (protobuf)
- **Cryptography:** ECDSA P-384 curve with SHA-384 hashing
- **Development:** Nodemon + ts-node

### Frontend  
- **Framework:** React 19 with TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Build Tool:** Vite

### Security
- **Algorithm:** ECDSA (Elliptic Curve Digital Signature Algorithm)
- **Curve:** P-384 (secp384r1)
- **Hash:** SHA-384
- **Key Management:** Automatic generation and persistence

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │    │   Express API    │    │   SQLite DB     │
│                 │    │                  │    │                 │
│ • Dashboard     │◄──►│ • CRUD Routes    │◄──►│ • Users Table   │
│ • User Forms    │    │ • Crypto Service │    │ • Constraints   │
│ • Charts        │    │ • Proto Service  │    │ • Indexes       │
│ • Verification  │    │ • Validation     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Data Flow
1. **User Creation:** Form → API → Crypto Sign → Database
2. **Data Export:** Database → Protocol Buffer → Binary Response  
3. **Verification:** Frontend → Crypto Verify → Display Valid Users
4. **Analytics:** Database → Aggregate → Chart Visualization

## Development Workflow

### Prerequisites
- Node.js 18+ 
- npm 8+

### Setup
```bash
# Clone repository
git clone https://github.com/kwizeradev/qt-admin-panel-fabricekwizera.git
cd qt-admin-panel-fabricekwizera

# Install dependencies for all projects
npm run install:all

# Start development servers (both frontend and backend)
npm run dev
```

### Individual Services
```bash
# Backend only (http://localhost:3000)
cd backend && npm run dev

# Frontend only (http://localhost:5173) 
cd frontend && npm run dev
```

### Build for Production
```bash
# Backend
cd backend && npm run build && npm start

# Frontend  
cd frontend && npm run build && npm run preview
```

## API Endpoints

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/:id` - Get specific user

### Analytics
- `GET /api/users/stats` - Get user statistics

### Export & Security
- `GET /api/users/export` - Export users as Protocol Buffer
- `GET /api/public-key` - Get public key for verification

### Health
- `GET /health` - Server health check

## Key Implementation Details

### Protocol Buffers
- **Schema:** Defined in `backend/src/proto/user.proto`
- **Encoding:** Server serializes to binary format
- **Decoding:** Frontend decodes using protobufjs
- **Content-Type:** `application/octet-stream`

### Digital Signatures
- **Creation:** Email hashed with SHA-384, signed with ECDSA private key
- **Verification:** Frontend verifies using WebCrypto API
- **Key Generation:** Automatic ECDSA P-384 keypair creation
- **Storage:** Keys persisted in `backend/keys/` directory

### User Verification Flow
1. User created → Email signed with private key
2. Frontend fetches public key from `/api/public-key`  
3. Each user signature verified client-side
4. Only verified users displayed in table

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

*Requires WebCrypto API support for signature verification*

## Design Decisions & Scope

This implementation is **intentionally scoped** for a technical assessment, prioritizing clean, working code over enterprise patterns that would be over-engineering for this test.

### **What's Included**
- **Direct routing** - Routes handle business logic appropriately for this scope
- **Inline services** - Crypto and database operations integrated where they make sense
- **Essential validation** - Input validation without complex middleware layers
- **Working features** - All requirements implemented and functional

### **Production Considerations**
For a production system, I would consider adding:
- **Authentication & authorization** middleware with JWT/OAuth
- **Request rate limiting** and input sanitization middleware  
- **Comprehensive testing** (unit, integration, e2e)
- **API documentation** with OpenAPI/Swagger
- **Logging & monitoring** with structured logs
- **Error tracking** and performance monitoring
- **Docker containerization** and environment configs

## Author

**Fabrice Kwizera**  
GitHub: [@kwizeradev](https://github.com/kwizeradev)