# Smart Service Marketplace API

A scalable RESTful backend API for a **Smart Service Marketplace** inspired by platforms like Fiverr and Upwork.

The project provides secure authentication, service management, bookings, reviews, payments, messaging, and role-based authorization using modern backend technologies.

---

## Features

- JWT Authentication
- Role-Based Authorization (Client / Provider / Admin)
- User Management
- Service CRUD Operations
- Booking Management
- Review & Rating System
- Payment APIs
- Messaging System
- Real-time communication using Socket.IO
- MongoDB Database
- Seed Scripts
- RESTful API Architecture

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Socket.IO
- dotenv

---

## Project Structure

```
config/
controllers/
database/
middleware/
models/
routes/
schemas/
seed/
socket/
utils/
server.js
app.js
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/devawais01/smart-service-marketplace-api.git
```

Navigate to the project

```bash
cd smart-service-marketplace-api
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000
MONGODB_URI=your_connection_string
JWT_SECRET=your_secret_key
```

Run the project

```bash
npm start
```

Development

```bash
npm run dev
```

---

## Seed Database

```bash
npm run seed
```

Force reseed

```bash
npm run seed:force
```

---

## API Documentation

Detailed API documentation is included in:

```
API_DOCUMENTATION.txt
```

The API currently includes **35+ endpoints** covering:

- Authentication
- Users
- Services
- Bookings
- Reviews
- Payments
- Messaging
- Admin

---

## Security

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role-Based Access Control

---

## Future Improvements

- File Uploads
- Stripe Payment Integration
- Email Verification
- Password Reset
- Docker Deployment
- Swagger Documentation
- Unit Testing
- CI/CD Pipeline

---

## Author

**Muhammad Awais**

GitHub:
https://github.com/devawais01

LinkedIn:
https://www.linkedin.com/in/dev-awais01

---

## License

This project is developed for educational and portfolio purposes.