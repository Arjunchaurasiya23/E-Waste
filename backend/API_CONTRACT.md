# API Contract Documentation

Complete API contract for Scrap Smart India Backend.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "errors": {
    "field": ["Validation error"]
  }
}
```

---

## Authentication Endpoints

### Send OTP

**POST** `/auth/send-otp`

Request:
```json
{
  "phone": "9876543210"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully"
  }
}
```

### Verify OTP

**POST** `/auth/verify-otp`

Request:
```json
{
  "phone": "9876543210",
  "code": "1234",
  "role": "CUSTOMER" // Optional for new users
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
      "id": "user_id",
      "phone": "9876543210",
      "name": "User Name",
      "role": "CUSTOMER",
      "language": "en"
    }
  }
}
```

---

## User Endpoints

### Get Profile

**GET** `/users/me`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "phone": "9876543210",
    "name": "User Name",
    "role": "CUSTOMER",
    "email": "user@example.com",
    "language": "en",
    "pincode": "110016"
  }
}
```

### Update Profile

**PUT** `/users/me`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "name": "New Name",
  "email": "new@example.com",
  "language": "hi"
}
```

---

## Pickup Endpoints

### Create Pickup

**POST** `/pickups`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "address": {
    "line1": "123, Street Name",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110016"
  },
  "scheduledDate": "2024-03-25T00:00:00Z",
  "scheduledSlotId": "morning",
  "items": [
    {
      "type": "PAPER",
      "estimatedWeight": 10,
      "pricePerKg": 14,
      "estimatedAmount": 140
    }
  ],
  "assistedMode": false,
  "notes": "Optional notes"
}
```

### Get Pickups

**GET** `/pickups?status=REQUESTED&page=1&limit=10`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "data": {
    "pickups": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### Get Pickup by ID

**GET** `/pickups/:id`

Headers: `Authorization: Bearer <token>`

---

## Collector Endpoints

### Get Available Pickups

**GET** `/pickups/collector/available?page=1&limit=10`

Headers: `Authorization: Bearer <token>` (Collector role required)

### Accept Pickup

**POST** `/pickups/collector/:id/accept`

Headers: `Authorization: Bearer <token>` (Collector role required)

### Start Pickup

**POST** `/pickups/collector/:id/start`

Headers: `Authorization: Bearer <token>` (Collector role required)

### Submit Weight

**POST** `/pickups/collector/:id/weigh`

Headers: `Authorization: Bearer <token>` (Collector role required)

Request:
```json
{
  "items": [
    {
      "type": "PAPER",
      "actualWeight": 12,
      "pricePerKg": 14
    }
  ]
}
```

### Complete Pickup

**POST** `/pickups/collector/:id/complete`

Headers: `Authorization: Bearer <token>` (Collector role required)

---

## Transaction Endpoints

### Get Transactions

**GET** `/transactions?type=CREDIT&page=1&limit=10`

Headers: `Authorization: Bearer <token>`

### Get Wallet Balance

**GET** `/transactions/wallet/balance`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "data": {
    "balance": 500.00
  }
}
```

### Request Payout

**POST** `/transactions/wallet/payout`

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "amount": 500,
  "upiId": "user@paytm"
}
```

---

## Pricing Endpoints

### Get All Pricing

**GET** `/pricing`

Public endpoint, no authentication required.

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "pricing_id",
      "type": "PAPER",
      "pricePerKg": 14,
      "minQuantity": 2,
      "icon": "📰",
      "labelEn": "Paper / Cardboard",
      "labelHi": "कागज / गत्ता"
    }
  ]
}
```

### Update Pricing

**PUT** `/pricing/:type`

Headers: `Authorization: Bearer <token>` (Admin role required)

Request:
```json
{
  "pricePerKg": 15,
  "minQuantity": 2
}
```

---

## Admin Endpoints

### Get Dashboard Stats

**GET** `/admin/dashboard`

Headers: `Authorization: Bearer <token>` (Admin role required)

Response:
```json
{
  "success": true,
  "data": {
    "totalPickups": 150,
    "totalCustomers": 50,
    "totalCollectors": 10,
    "activeCollectors": 8,
    "pendingPickups": 5,
    "completedPickupsToday": 12
  }
}
```

### Get Analytics

**GET** `/admin/analytics?startDate=2024-01-01&endDate=2024-03-31`

Headers: `Authorization: Bearer <token>` (Admin role required)

---

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Status Codes

### Pickup Status Flow

1. `REQUESTED` - Customer created pickup
2. `ASSIGNED` - Collector accepted
3. `ON_THE_WAY` - Collector started
4. `WEIGHING` - Weight submitted
5. `PICKED` - Pickup completed
6. `PAID` - Payment processed
7. `CANCELLED` - Cancelled at any stage

### Collector Status

- `PENDING` - Awaiting approval
- `APPROVED` - Active collector
- `SUSPENDED` - Temporarily suspended

### Transaction Status

- `PENDING` - Processing
- `COMPLETED` - Successfully processed
- `FAILED` - Processing failed

