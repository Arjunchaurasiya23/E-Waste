# Scrap Smart India - Backend API

Production-grade backend API for the Scrap Smart India waste collection platform.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + OTP
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## Architecture

Clean Architecture with clear separation of concerns:

```
src/
├── config/          # Configuration (env, database, constants)
├── middleware/      # Express middlewares (auth, validation, error)
├── routes/          # API route definitions
├── controllers/     # Request handlers (thin layer)
├── services/        # Business logic layer
├── repositories/    # Data access layer (Prisma)
├── validators/      # Zod validation schemas
└── utils/           # Utilities (JWT, errors, responses)
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
NODE_ENV=development
PORT=3000
API_PREFIX=/api

DATABASE_URL="postgresql://user:password@localhost:5432/scrap_smart_india?schema=public"

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=30d

OTP_EXPIRES_IN_MINUTES=10
OTP_LENGTH=4
OTP_MOCK_MODE=true

CORS_ORIGIN=http://localhost:8080
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

### 4. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/me/address` - Get user address

### Pickups
- `POST /api/pickups` - Create pickup request
- `GET /api/pickups` - Get user's pickups
- `GET /api/pickups/:id` - Get pickup details
- `PUT /api/pickups/:id` - Update pickup

### Collector Actions
- `GET /api/pickups/collector/available` - Get available pickups
- `POST /api/pickups/collector/:id/accept` - Accept pickup
- `POST /api/pickups/collector/:id/start` - Start pickup
- `POST /api/pickups/collector/:id/weigh` - Submit weight
- `POST /api/pickups/collector/:id/complete` - Complete pickup

### Transactions/Wallet
- `GET /api/transactions` - Get transactions
- `GET /api/transactions/wallet/balance` - Get wallet balance
- `POST /api/transactions/wallet/payout` - Request payout

### Collectors
- `GET /api/collectors` - List collectors (admin)
- `GET /api/collectors/:id` - Get collector details
- `PUT /api/collectors/:id/status` - Update status (admin)
- `GET /api/collectors/me` - Get own profile (collector)
- `GET /api/collectors/me/earnings` - Get earnings (collector)

### Pricing
- `GET /api/pricing` - Get all pricing (public)
- `PUT /api/pricing/:type` - Update pricing (admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/analytics` - Analytics data

## Development

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Prisma Studio (database GUI)
npm run prisma:studio
```

## Database Migrations

```bash
# Create a new migration
npm run prisma:migrate

# Apply migrations
npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

## Testing

Default test users (from seed):
- **Admin**: Phone `9876543212`
- **Customer**: Phone `9876543210`
- **Collector**: Phone `9876543211`

Use OTP `1234` in mock mode (or check console logs).

## Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation with Zod
- Rate limiting on OTP endpoints
- SQL injection protection (Prisma)
- CORS configuration
- Helmet security headers

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
3. Configure real database URL
4. Set up SMS provider (disable `OTP_MOCK_MODE`)
5. Configure proper CORS origins
6. Set up reverse proxy (nginx)
7. Use process manager (PM2)
8. Enable HTTPS

## License

ISC

