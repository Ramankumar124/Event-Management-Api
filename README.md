# Event Management API

This is a RESTful API for managing events. You can create events, register users for events, and view event details.

## API Description

The Event Management API provides endpoints for creating, reading, and managing events and user registrations. It's built with Node.js, Express, TypeScript, and Prisma.

## Setup Instructions

### Prerequisites

-   Node.js
-   npm (or yarn)
-   postgress Db

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Ramankumar124/Event-Management-Api.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd Event-Management-Api
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Database Setup

This project uses Prisma for database management.

1.  Make sure you have a PostgreSQL database running.
2.  Create a `.env` file in the root of the project and add your database connection string:
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```
3.  Run the database migrations:
    ```bash
    npx prisma migrate dev
    ```

### Running the Application

To run the application in development mode (with hot-reloading):

```bash
npm run dev
```

The API will be available at `http://localhost:3000` (or the port you configure).

## Folder Structure

The project follows a standard Node.js project structure:

```
.
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
├── src/
│   ├── config/
│   ├── controller/
│   ├── database/
│   ├── middleware/
│   ├── routes/
│   ├── schema/
│   ├── service/
│   └── utils/
├── app.log
├── nodemon.json
├── package.json
└── tsconfig.json
```

-   `prisma/`: Contains all files related to the Prisma ORM, including the database schema (`schema.prisma`) and migration history.
-   `public/`: Can be used to store static files.
-   `src/`: Contains the main source code for the application.
    -   `config/`: For application configuration files.
    -   `controller/`: Contains the route handlers (controllers) that process incoming requests.
    -   `database/`: For database connection and setup.
    -   `middleware/`: For Express middleware functions.
    -   `routes/`: Defines the API routes.
    -   `schema/`: Contains validation schemas (e.g., for request bodies).
    -   `service/`: Can be used for business logic, separating it from the controllers.
    -   `utils/`: For utility functions and classes.
-   `app.log`: Log file for the application.
-   `nodemon.json`: Configuration for `nodemon`.
-   `package.json`: Project metadata and dependencies.
-   `tsconfig.json`: TypeScript compiler options.

## API Workflow

The typical workflow for using this API is as follows:

1.  **Create an Event:** An event is created first. This can be done by sending a `POST` request to the `/api/v1/events` endpoint.
2.  **Create a User:** A user is created by sending a `POST` request to the `/api/v1/auth` endpoint.
3.  **Register User for Event:** Once you have an event and a user, you can register the user for the event. This is done by sending a `POST` request to the `/api/v1/events/:eventId/register` endpoint, where `:eventId` is the ID of the event. The user's ID should be included in the request body.

## API Routes

All routes are prefixed with `/api/v1`.

### Authentication Routes

-   **`POST /auth`**: Create a new user.
    -   **Request Body:**
        ```json
        {
          "email": "user@example.com",
          "name": "Test User"
        }
        ```
    -   **Example Response (201 Created):**
        ```json
        {
            "statusCode": 201,
            "data": {
                "id": "clxfa2x2q0000unx4c5f9h8g8",
                "email": "user@example.com",
                "name": "Test User"
            },
            "message": "User created successfully",
            "success": true
        }
        ```

### Event Routes

-   **`POST /events`**: Create a new event.
    -   **Request Body:**
        ```json
        {
          "name": "My Awesome Event",
          "date": "2025-12-31T23:59:59.999Z",
          "location": "Someplace, Earth"
        }
        ```
    -   **Example Response (201 Created):**
        ```json
        {
            "statusCode": 201,
            "data": {
                "id": "clxfa3a4b0001unx4h6g9e8k9",
                "name": "My Awesome Event",
                "date": "2025-12-31T23:59:59.999Z",
                "location": "Someplace, Earth"
            },
            "message": "Event created successfully",
            "success": true
        }
        ```

-   **`GET /events/upcoming`**: Get a list of all upcoming events.
    -   **Example Response (200 OK):**
        ```json
        {
            "statusCode": 200,
            "data": [
                {
                    "id": "clxfa3a4b0001unx4h6g9e8k9",
                    "name": "My Awesome Event",
                    "date": "2025-12-31T23:59:59.999Z",
                    "location": "Someplace, Earth"
                }
            ],
            "message": "Upcoming events retrieved successfully",
            "success": true
        }
        ```

-   **`GET /events/:id`**: Get details for a specific event.
    -   `:id` - The ID of the event.
    -   **Example Response (200 OK):**
        ```json
        {
            "statusCode": 200,
            "data": {
                "id": "clxfa3a4b0001unx4h6g9e8k9",
                "name": "My Awesome Event",
                "date": "2025-12-31T23:59:59.999Z",
                "location": "Someplace, Earth",
                "registrations": []
            },
            "message": "Event retrieved successfully",
            "success": true
        }
        ```

-   **`POST /events/:eventId/register`**: Register a user for an event.
    -   `:eventId` - The ID of the event.
    -   **Request Body:**
        ```json
        {
          "userId": "clxfa2x2q0000unx4c5f9h8g8"
        }
        ```
    -   **Example Response (200 OK):**
        ```json
        {
            "statusCode": 200,
            "data": {
                "id": "clxfa4b5c0002unx4j7k8l9m0",
                "eventId": "clxfa3a4b0001unx4h6g9e8k9",
                "userId": "clxfa2x2q0000unx4c5f9h8g8",
                "registeredAt": "2025-07-15T12:00:00.000Z"
            },
            "message": "User registered for event successfully",
            "success": true
        }
        ```

-   **`DELETE /events/:eventId/register/:userId`**: Cancel a user's registration for an event.
    -   `:eventId` - The ID of the event.
    -   `:userId` - The ID of the user.
    -   **Example Response (200 OK):**
        ```json
        {
            "statusCode": 200,
            "data": {},
            "message": "User registration cancelled successfully",
            "success": true
        }
        ```

-   **`GET /events/:eventId/stats`**: Get statistics for a specific event (e.g., number of registered users).
    -   `:eventId` - The ID of the event.
    -   **Example Response (200 OK):**
        ```json
        {
            "statusCode": 200,
            "data": {
                "registrations": 150
            },
            "message": "Event stats retrieved successfully",
            "success": true
        }
        ```
