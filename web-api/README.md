# User Management API

A TypeScript Express REST API for managing users with full CRUD operations.

## Features

- ✅ **Read**: Get all users with pagination and search by name
- ✅ **Create**: Add new users
- ✅ **Update**: Edit existing users
- ✅ **Delete**: Remove users
- ✅ **Search**: Filter users by name
- ✅ **Pagination**: Paginate through user list
- ✅ **Error Handling**: Comprehensive error handling
- ✅ **TypeScript**: Full type safety

## Tech Stack

- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3678`

### 3. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Base URL
```
http://localhost:3678/api/users
```

### 1. Get All Users (with pagination and search)

**GET** `/api/users`

Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: all)
- `search` (optional): Search by name

Examples:
```bash
# Get all users
curl http://localhost:3678/api/users

# Get users with pagination
curl http://localhost:3678/api/users?page=1&limit=5

# Search users by name
curl http://localhost:3678/api/users?search=Leanne

# Combine pagination and search
curl http://localhost:3678/api/users?page=1&limit=5&search=Graham
```

Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 5,
    "totalPages": 2
  }
}
```

### 2. Get User by ID

**GET** `/api/users/:id`

Example:
```bash
curl http://localhost:3678/api/users/1
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Leanne Graham",
    "email": "Sincere@april.biz",
    ...
  }
}
```

### 3. Create New User

**POST** `/api/users`

Example:
```bash
curl -X POST http://localhost:3678/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "address": {
      "street": "Main Street",
      "suite": "Apt. 100",
      "city": "New York",
      "zipcode": "10001",
      "geo": {
        "lat": "40.7128",
        "lng": "-74.0060"
      }
    },
    "phone": "555-1234",
    "website": "johndoe.com",
    "company": {
      "name": "Doe Inc",
      "catchPhrase": "Innovation at its best",
      "bs": "cutting-edge solutions"
    }
  }'
```

Response:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 11,
    "name": "John Doe",
    ...
  }
}
```

### 4. Update User

**PUT** `/api/users/:id`

Example:
```bash
curl -X PUT http://localhost:3678/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "email": "updated@example.com"
  }'
```

Response:
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Name",
    "email": "updated@example.com",
    ...
  }
}
```

### 5. Delete User

**DELETE** `/api/users/:id`

Example:
```bash
curl -X DELETE http://localhost:3678/api/users/1
```

Response:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Error Handling

All endpoints include comprehensive error handling:

- **400 Bad Request**: Invalid input or missing required fields
- **404 Not Found**: User not found
- **500 Internal Server Error**: Server errors

Example error response:
```json
{
  "success": false,
  "message": "User not found"
}
```

## Project Structure

```
web-api/
├── src/
│   ├── controllers/
│   │   └── user.controller.ts    # Request handlers
│   ├── services/
│   │   └── user.service.ts       # Business logic
│   ├── routes/
│   │   └── user.routes.ts        # Route definitions
│   ├── types/
│   │   └── user.types.ts         # TypeScript interfaces
│   ├── data/
│   │   └── users.data.ts         # Initial data
│   └── server.ts                 # Express app setup
├── public/
│   ├── index.html                # Frontend HTML
│   ├── styles.css                # Frontend CSS
│   └── app.js                    # Frontend JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Frontend

The API includes a frontend web application accessible at `http://localhost:3678`

Features:
- View users in a table
- Search users by name
- Add new users via modal form
- Edit users via modal form
- Delete users with confirmation
- Pagination controls

## Notes

- Uses async/await pattern (not .then())
- In-memory data storage (resets on server restart)
- CORS enabled for cross-origin requests
- Full TypeScript type safety
- RESTful API design

## Development

The API uses in-memory storage, so all changes will be lost when the server restarts. For production use, consider integrating a database like MongoDB, PostgreSQL, or MySQL.
