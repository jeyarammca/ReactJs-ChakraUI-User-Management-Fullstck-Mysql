# User Management API

Node.js + Express backend to serve a mockup user list from MySQL.

## Prerequisites

- Node.js (v14+)
- MySQL Server

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   - Create a database named `interview_task`.
   - Run the SQL script found in `schema.sql` to create the `users` table and seed data.

3. **Environment Variables**:
   - Update `.env` with your MySQL credentials:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=interview_task
     PORT=5000
     ```

4. **Run Server**:
   ```bash
   node server.js
   ```

## Endpoints

- `GET /users`: Returns the list of users from the database.
