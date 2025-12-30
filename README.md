# Mini User Management System

Full-stack user and admin management app built for the Purple Merit Backend Developer Intern assessment. Supports JWT auth, RBAC, and user lifecycle controls with a deployed frontend and backend.

## 🌐 Live Links

- Frontend (Vercel): [https://user-management-frontend-five-taupe.vercel.app/](https://user-management-frontend-five-taupe.vercel.app/)
- Backend API (Render): [https://user-management-system-iip6.onrender.com/](https://user-management-system-iip6.onrender.com/)
- Repo: [https://github.com/badalOraon-06/user-management-system](https://github.com/badalOraon-06/user-management-system)

**Seed Admin (dev only):** `admin@example.com` / `Admin@123`

## 📋 Overview

- JWT-based auth with role-based access (admin/user)
- Admins: list users with pagination, activate/deactivate with confirmations
- Users: view/update profile, change password
- Secure patterns: hashed passwords, auth middleware, CORS allowlist, env-based secrets
- Responsive UI with custom CSS design system

## 🚀 Tech Stack

**Backend**

- Node.js + Express
- MongoDB Atlas
- Auth: JWT, bcryptjs
- Testing: Jest + Supertest
- Deployment: Render

**Frontend**

- React 19 (Vite)
- Router: React Router DOM v7
- HTTP: Axios
- State: React Context
- Styling: Custom CSS
- Deployment: Vercel

**Tooling**

- eslint, npm scripts

## 📂 Project Structure

## 📦 Project Structure

```
user-management-system/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── userController.js    # User management logic
│   ├── middleware/
│   │   └── auth.js              # JWT verification & RBAC
│   ├── models/
│   │   └── User.js              # User schema with validation
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── userRoutes.js        # User management endpoints
│   ├── utils/
│   │   └── jwt.js               # JWT helper functions
│   ├── __tests__/
│   │   ├── auth.test.js         # Authentication tests
│   │   └── user.test.js         # User management tests
│   ├── app.js                   # Express app configuration
│   ├── server.js                # Server entry point
│   └── .env                     # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoutes.jsx   # Route guards
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global auth state
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Signup.jsx            # Signup page
│   │   │   ├── UserDashboard.jsx     # User dashboard
│   │   │   └── AdminDashboard.jsx    # Admin dashboard
│   │   ├── services/
│   │   │   └── api.js                # API client with interceptors
│   │   ├── App.jsx                   # Main app with routing
│   │   └── main.jsx                  # React entry point
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

## ✨ Features (per assessment)

- Auth: signup/login, JWT issuance, current-user endpoint, logout
- Validation: email format, password length, consistent error responses
- User (self): view profile, update name/email, change password
- Admin: list users with pagination (10/page), activate/deactivate with confirmation, cannot deactivate self
- Security: bcrypt hashing, auth guard, RBAC, active-status checks, CORS allowlist, env-driven secrets
- UX: responsive layout, loading states, success/error alerts, confirmation modals, nav with name/role, custom theming

## 🛠️ Setup Instructions

- API demonstration

## 🔍 Key Implementation Details

### Database Schema

```javascript
User {
  fullName: String (required)
  email: String (required, unique, validated)
  password: String (required, hashed)
  role: String (enum: ['user', 'admin'], default: 'user')
  status: String (enum: ['active', 'inactive'], default: 'active')
  lastLogin: Date
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Middleware Stack

1. CORS configuration for frontend communication
2. Express JSON parser
3. JWT verification middleware
4. Role-based access control middleware
5. Active account status verification

### Security Measures

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens with 7-day expiration
- Protected routes require valid JWT
- Admin routes require admin role
- Inactive accounts blocked from access
- Input validation on all endpoints
- Environment variables for secrets

## 📝 Development Notes

### Commit History

This project follows proper git practices with:

- Incremental commits throughout development
- Descriptive commit messages
- Separate commits for features, fixes, and tests

### Code Quality

- Modular architecture with separation of concerns
- MVC pattern in backend
- Component-based architecture in frontend
- Clean code with consistent naming conventions
- Error handling at all levels
- Input validation and sanitization

## 🐛 Known Issues & Future Enhancements

### Future Enhancements

- Email verification on signup
- Password reset via email
- User profile pictures
- Activity logs
- Export user data
- Advanced filtering and search
- Dark mode toggle

## 👤 Author

**Badal Oraon**

- GitHub: [@badalOraon-06](https://github.com/badalOraon-06)
- Email: career@purplemerit.com

## 📄 License

This project is created for the Purple Merit Backend Developer Internship Assessment.

## 🙏 Acknowledgments

- Purple Merit Technologies for the assessment opportunity
- MongoDB Atlas for cloud database hosting
- Render/Vercel for deployment platforms

---

**Assessment Details:**

- Position: Backend Developer Intern
- Company: Purple Merit Technologies
- Start Time: 29th December 2025, 11:00 AM (IST)
- Deadline: 31st December 2025, 11:00 AM (IST)
- Duration: 48 hours

- User authentication (signup/login)
- Role-based access control (Admin/User)
- User profile management
- Admin dashboard for user management
- Secure password hashing
- JWT token-based authentication

## 🔗 Links

- Frontend: [Coming soon]
- Backend API: [Coming soon]
- API Documentation: [Coming soon]

---

**Status:** 🚧 In Development
