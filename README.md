<h1 align="center">
  <br>
  <img src="/client/public/favicon.svg" alt="Your Project Logo" width="200">
  <br>
  Full Stack CRUD Application
  <br>
</h1>

<h4 align="center">A comprehensive data management system built with <a href="https://nodejs.org/" target="_blank">Node.js</a>, <a href="https://reactjs.org/" target="_blank">React</a> and <a href="https://www.mongodb.com/" target="_blank">MongoDB</a>.</h4>

<p align="center">
  <a href="https://repo-exam.vercel.app/"><img src="https://img.shields.io/badge/status-developed-red?style=for-the-badge&logo=vercel" alt="Developed"></a>
  <a href="https://github.com/sughino/repo-exam"><img src="https://img.shields.io/badge/Author-Grasso%20Ludovico-blue?style=for-the-badge&logo=github" alt="Grasso Ludovico"></a>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#authentication">Authentication</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#api-endpoints">API Endpoints</a> •
  <a href="#libraries">Libraries</a> •
  <a href="#development">Development</a> •
  <a href="#license">License</a>
</p>

![screenshot](/client/public/registrazione.gif)

# 🧭 Overview
This full-stack web application provides a modern, responsive interface and a robust backend infrastructure designed for scalability and performance. Built using **React**, **Node.js**, **MongoDB**, and **Vite**, the project follows a modular architecture and integrates real-time features via **Socket.IO**.

## 🧰 Key Features

* Complete CRUD Functionality
  - Create, read, update, and delete data with an intuitive user interface
* Real-time Data Updates
  - See changes instantly without refreshing the page
* Authentication System
  - Secure user registration and login flow
  - Password encryption and secure token handling
* Authorization Levels
  - Role-based access control (Admin/User)
  - Protected routes based on user permissions
* Token-based Authentication
  - JWT implementation for secure API access
* Public API Endpoints
  - Access certain data without authentication
* Responsive Design
  - Fully functional on desktop and mobile devices
* Data Filtering and Sorting
  - Advanced search functionality
  - Multiple filter options
* Error Handling
  - Comprehensive client and server-side error management
* Form Validation
  - Client and server-side validation for data integrity

## ✨ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling tool

### Frontend
- **React** - UI library
- **Vite** - Frontend build tool
- **React Router** - Navigation and routing
- **Context API/Redux** - State management

### Authentication & Security
- **JWT (JSON Web Tokens)** - Secure information transmission
- **bcrypt** - Password hashing
- **cors** - Cross-Origin Resource Sharing
- **helmet** - HTTP headers security
- **rate limit** - To limit repeated requests

## 🏗️ Architecture

The application follows a standard three-tier architecture:

1. **Presentation Layer** (Frontend)
   - React components for UI
   - State management with Context API or Redux
   - HTTP client for API communication

2. **Application Layer** (Backend)
   - Express.js REST API
   - Authentication middleware
   - Business logic controllers
   - Data validation

3. **Data Layer**
   - MongoDB database
   - Mongoose schemas and models
   - Data access logic

## 🔐 Authentication

The application implements a robust authentication system:

- **Registration Flow**
  - User information validation
  - Password encryption with bcrypt
  - Account creation in database

- **Login Flow**
  - Credential verification
  - JWT token generation
  - Secure cookie or localStorage token storage

- **Authorization**
  - Role-based access control
  - Protected routes and resources
  - Token verification middleware

- **Security Features**
  - CORS protection
  - XSS prevention
  - Rate limiting
  - Environment variable management

## 🚀 How To Use

To clone and run this application, you'll need [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) and [MongoDB](https://www.mongodb.com/try/download/community) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/yourusername/your-project

# Navigate to the repository
$ cd your-project

# Install backend dependencies
$ cd server
$ npm install

# Set up environment variables
$ cp .env.example .env
# Edit .env with your database connection string and JWT secret

# Install frontend dependencies
$ cd ../client
$ npm install

# Start development servers
# Terminal 1 (Backend)
$ cd server
$ npm run dev

# Terminal 2 (Frontend)
$ cd client
$ npm run dev
```

> **Note**
> Make sure MongoDB is running on your system or you have a valid MongoDB Atlas connection string in your environment variables.

## 🛠️ Environment Variables Setup

To run the application correctly, you need to create two separate `.env` files: one for the **backend** and one for the **frontend**.

### 📁 Backend – `.env`

Create a `.env` file inside the `/config` directory and paste the following content:

```env
NODE_ENV = Choose environments

JWT_SECRET = Secret code for coockie
JWT_SECRET_REFRESH = Secret code for refresh coockie

JWT_EXPIRES_IN = The expiration time of the coockie
JWT_REFRESH_EXPIRES_IN = The expiration time of the refresh coockie (for the “remind me”)
JWT_LONG_REFRESH_EXPIRES_IN=30d The expiration time of the coockie (for the “remind me”)

DB_USER = Your MongoDB user
DB_PASSWORD = Your MongoDB password
DB_NAME= Your MongoDB db name

FRONTEND_URL_DEV = Your front-end base url (in your dev environments)
```

Create a `.env.production` file inside the `/config` directory and paste the following content:

```env
FRONTEND_URL_PRODUCTION = Your front-end base url (in your production environments)
```

### 📁 Frontend – `.env`

Create a `.env` file inside the `/client` directory and paste the following content:

```env
VITE_API_URL = Your back-end base url (in your dev environments)
```

Create a `.env.production` file inside the `/client` directory and paste the following content:

```env
VITE_API_URL = Your back-end base url (in your production environments)
```
---

## 🎯 API Endpoints

### Public Endpoints
```
GET /api/data              - Retrieve public data
GET /api/data/:id          - Retrieve specific public data item
```

### Protected Endpoints
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - User login
GET /api/users/profile     - Get user profile

GET /api/data/private      - Retrieve all data (authenticated)
POST /api/data             - Create new data entry
PUT /api/data/:id          - Update data entry
DELETE /api/data/:id       - Delete data entry

# Admin Only
GET /api/admin/users       - Get all users
PUT /api/admin/users/:id   - Update user
DELETE /api/admin/users/:id - Delete user
```

## 📚 Libraries

The project utilizes approximately 30 key libraries:

### 🧩 Backend Libraries
1. **express** – Web framework for building APIs
2. **cors** – Cross-origin resource sharing
3. **dotenv** – Environment variable management
4. **nodemon** – Dev server with auto-reload
5. **mongodb** – Native MongoDB driver
5. **mongoose** – MongoDB object modeling
6. **bcrypt** – Password hashing
7. **morgan** – HTTP request logger
8. **jsonwebtoken** – JWT implementation
9. **helmet** – Security middleware
10. **express-rate-limit** – Basic API rate-limiting
11. **cookie-parser** – Cookie management
12. **csv-parser** – Parse CSV files (if you're importing/exporting data)
13. **socket.io** – Real-time communication (server side)
14. **node-cache** – In-memory caching

### 🎨 Frontend Libraries
1. **react & react-dom** – UI rendering
2. **vite** – Fast frontend bundler
3. **react-router-dom** – SPA routing
4. **axios** – HTTP client
5. **formik** – Form management
6. **yup** – Form schema validation
7. **swr** – Data fetching & caching
8. **react-toastify** – Toast notifications
9. **@mui/material** – Material UI components
10. **@emotion/react & @emotion/styled** – CSS-in-JS for MUI
11. **styled-components** – Alternative styling solution
12. **lucide-react** – Icon set
13. **@react-spring/web** – Animation library
14. **framer-motion** – Advanced animations
15. **react-haiku** – Creative animation & effects
16. **ldrs** – Loader components
17. **socket.io-client** – Real-time communication (client side)
18. **date-fns** – Date formatting utilities
29. **ogl** – WebGL rendering library

## 📦 Development

### Code Structure

```
/
├── client/                  # Frontend React application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context for state management
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main application component
│   │   └── main.jsx         # Application entry point
|   ├── .env                 # Environment variables
│   └── package.json         # Frontend dependencies
│
├── server/                  # Backend Node.js application
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Express middleware
│   ├── models/              # Mongoose data models
│   ├── routes/              # API route definitions
│   ├── utils/               # Utility functions
│   ├── app.js               # Express application setup
│   ├── server.js            # Server entry point
│   └── package.json         # Backend dependencies
│
└── README.md                # Project documentation
```

### Best Practices Implemented
- Separation of concerns
- Environment configuration
- Proper error handling
- Input validation
- Secure authentication
- Responsive design patterns
- RESTful API design

## Future Enhancements

- OAuth integration for social login
- Real-time updates with WebSockets
- Advanced search functionality
- Data export options (CSV, PDF)
- User profile management
- Activity logging and user analytics
- Multi-language support

## 👨‍💻 Author

> GitHub [@sughino](https://github.com/sughino) &nbsp;&middot;&nbsp;
> LinkedIn [Ludovico Grasso](www.linkedin.com/in/ludovico-grasso)