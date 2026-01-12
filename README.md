# Car Rental System Backend

A Node.js backend API for a car rental system built with Express.js, PostgreSQL, and JWT authentication.

## Features

- User authentication (signup/login) with JWT tokens
- Create, read, update, and delete car rental bookings
- Booking summary and statistics
- Secure API endpoints with authentication middleware
- PostgreSQL database integration
- Password hashing with bcrypt
- Input validation and error handling

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Management**: dotenv

## Installation

1. Clone the repository:

git clone https://github.com/Shubhamkahar196/Car-rental-System-Backend.git
cd car-rental-system-backend


2. Install dependencies:

npm install


3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret_key"


4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`.

## API Endpoints

### Authentication

#### POST /api/auth/signup
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "User created Successfully",
    "userId": "number"
  }
}
```

#### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Login successfully",
    "token": "jwt_token_string"
  }
}
```

### Bookings

All booking endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### POST /api/bookings
Create a new booking.

**Request Body:**
```json
{
  "carName": "string",
  "days": "number",
  "rentPerDay": "number"
}
```

**Validation:**
- `days`: 1-364
- `rentPerDay`: 1-2000

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Booking created successfully",
    "bookingId": "number",
    "totalCost": "number"
  }
}
```

#### GET /api/bookings
Get user's bookings.

**Query Parameters:**
- `summary=true`: Get booking summary (total bookings and amount spent)
- No params: Get all bookings
- Include `id` in URL for single booking: `/api/bookings/{bookingId}`

**Response (all bookings):**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "user_id": "number",
      "car_name": "string",
      "days": "number",
      "rent_per_day": "number",
      "status": "string",
      "created_at": "timestamp",
      "totalCost": "number"
    }
  ]
}
```

**Response (summary):**
```json
{
  "success": true,
  "data": {
    "userId": "number",
    "username": "string",
    "totalBookings": "number",
    "totalAmountSpent": "number"
  }
}
```

#### PUT /api/bookings/{bookingId}
Update an existing booking.

**Request Body:**
```json
{
  "carName": "string (optional)",
  "days": "number (optional)",
  "rentPerDay": "number (optional)",
  "status": "string (optional)"
}
```

**Valid statuses:** "booked", "completed", "cancelled"

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Booking updated successfully",
    "booking": {
      "id": "number",
      "user_id": "number",
      "car_name": "string",
      "days": "number",
      "rent_per_day": "number",
      "status": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "totalCost": "number"
    }
  }
}
```

#### DELETE /api/bookings/{bookingId}
Delete a booking.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Booking deleted successfully"
  }
}
```

## Database Schema

The application uses two main tables:

### users
- `id` (Primary Key)
- `username` (Unique)
- `password` (Hashed)

### bookings
- `id` (Primary Key)
- `user_id` (Foreign Key to users.id)
- `car_name`
- `days`
- `rent_per_day`
- `status` (booked/completed/cancelled)
- `created_at`
- `updated_at`

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": "error_message"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request (invalid input)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (access denied)
- 404: Not Found
- 500: Internal Server Error

## Development

- Uses ES6 modules (`"type": "module"` in package.json)
- Development server with nodemon for auto-restart
- PostgreSQL database connection with connection pooling
- JWT tokens expire after 1 day


