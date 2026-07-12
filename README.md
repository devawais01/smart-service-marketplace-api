# Smart Service Marketplace API

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?logo=jsonwebtokens)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socketdotio)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

A scalable RESTful backend API for a **Smart Service Marketplace** inspired by platforms like Fiverr and Upwork. The project provides secure authentication, role-based authorization, service management, bookings, reviews, payments, messaging, and real-time communication using modern backend technologies.

---

## Features

- 🔐 JWT Authentication
- 👥 Role-Based Authorization (Client, Provider, Admin)
- 👤 User Management
- 🛠️ Service CRUD Operations
- 📅 Booking Management
- ⭐ Review & Rating System
- 💳 Payment APIs
- 💬 Messaging System
- ⚡ Real-time Communication with Socket.IO
- 🌐 RESTful API Architecture
- 🗄️ MongoDB Database Integration
- 🌱 Database Seed Scripts

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript Runtime |
| Express.js | Backend Framework |
| MongoDB | NoSQL Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Socket.IO | Real-time Communication |
| dotenv | Environment Variables |

---

## Project Structure

```text
.
├── config/
├── controllers/
├── database/
├── middleware/
├── models/
├── routes/
├── schemas/
├── seed/
├── socket/
├── utils/
├── app.js
├── server.js
├── package.json
└── API_DOCUMENTATION.txt
```

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/devawais01/smart-service-marketplace-api.git
```

### Navigate to the Project

```bash
cd smart-service-marketplace-api
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Run the Application

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

## Database Seeding

Populate the database:

```bash
npm run seed
```

Force reseed:

```bash
npm run seed:force
```

---

## API Documentation

The project includes comprehensive API documentation in:

```text
API_DOCUMENTATION.txt
```

The API includes more than **35 endpoints** covering:

- Authentication
- Users
- Services
- Bookings
- Reviews
- Payments
- Messaging
- Admin Operations

---

## Security Features

- JWT Authentication
- Password Hashing with bcrypt
- Protected Routes
- Role-Based Access Control
- Environment Variable Configuration

---

## Future Improvements

- File Upload Support
- Stripe Payment Integration
- Email Verification
- Password Reset
- Docker Support
- Swagger/OpenAPI Documentation
- Automated Testing
- GitHub Actions CI/CD
- Cloud Deployment

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

## Author

**Muhammad Awais**

- GitHub: https://github.com/devawais01
- LinkedIn: https://www.linkedin.com/in/dev-awais01

---

## License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for more details.