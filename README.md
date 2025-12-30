# Mini User Management System

A full-stack web application for managing user accounts with role-based authentication, built as part of the Purple Merit Backend Developer Internship Assessment.

## 📋 Project Overview

This User Management System provides a complete authentication and authorization solution with distinct user and admin roles. Users can manage their profiles and passwords, while admins have full control over user lifecycle management including activation and deactivation of accounts.

## 🌐 Live Deployment

**Frontend (Live Application):** [https://user-management-frontend-five-taupe.vercel.app/](https://user-management-frontend-five-taupe.vercel.app/)

**Backend API:** [https://user-management-system-iip6.onrender.com/](https://user-management-system-iip6.onrender.com/)

**GitHub Repository:** [https://github.com/badalOraon-06/user-management-system](https://github.com/badalOraon-06/user-management-system)

**Test Admin Account:**

- Email: `admin@example.com`
- Password: `admin123`

## 🚀 Tech Stack

### Backend

- **Framework:** Node.js + Express.js
- **Database:** MongoDB (Cloud-hosted on MongoDB Atlas)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcryptjs
- **Testing:** Jest + Supertest (21 passing tests)
- **Deployment:** Render/Railway

### Frontend

- **Framework:** React 19 with Vite
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS v4
- **State Management:** React Context API
- **Deployment:** Vercel/Netlify

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

## ✨ Features

### Authentication

- ✅ User signup with email validation
- ✅ Password strength validation (minimum 6 characters)
- ✅ Secure password hashing with bcryptjs
- ✅ JWT-based authentication (7-day token expiration)
- ✅ Login with credentials verification
- ✅ Automatic token management with Axios interceptors
- ✅ Logout functionality

### User Management - User Features

- ✅ View own profile information
- ✅ Update full name and email
- ✅ Change password (with current password verification)
- ✅ Protected routes for authenticated users

### User Management - Admin Features

- ✅ View all users with pagination (10 users per page)
- ✅ Activate user accounts
- ✅ Deactivate user accounts
- ✅ Confirmation dialog before actions
- ✅ Success/error notifications
- ✅ Cannot deactivate own account
- ✅ Admin-only route protection

### Security Features

- ✅ Password hashing with bcryptjs (salt rounds: 10)
- ✅ JWT token verification middleware
- ✅ Role-based access control (admin/user)
- ✅ Protected routes with authentication checks
- ✅ Active account status verification
- ✅ Input validation on all endpoints
- ✅ Consistent error response format
- ✅ Environment variables for sensitive data
- ✅ CORS configuration

### UI/UX Features

- ✅ Responsive design (desktop & mobile)
- ✅ Loading states during API calls
- ✅ Success/error message notifications
- ✅ Form validation with error messages
- ✅ Confirmation dialogs for destructive actions
- ✅ Navigation bar with user info and role display
- ✅ Clean and modern interface with Tailwind CSS

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/badalOraon-06/user-management-system.git
   cd user-management-system/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create .env file**

   ```bash
   # Create .env file in backend folder
   touch .env
   ```

4. **Configure environment variables** (see Environment Variables section below)

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:5000`

6. **Run tests**
   ```bash
   npm test
   ```

### Frontend Setup

1. **Navigate to frontend folder**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

### Create Admin Account

Once both servers are running, create an admin account:

1. Visit: `http://localhost:5000/reactivate-admin`
2. Login with: `admin@example.com` / `admin123`

Or signup normally and manually change the role to 'admin' in MongoDB Atlas.

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

### Frontend (Optional)

The frontend uses `http://localhost:5000/api` as the default backend URL. To change it, update `baseURL` in `frontend/src/services/api.js`.

## 📡 API Documentation

### Base URL

```
Local: http://localhost:5000/api
Production: https://user-management-system-iip6.onrender.com/api
```

### Authentication Endpoints

#### 1. User Signup

```http
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active"
  }
}
```

#### 2. User Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active",
    "lastLogin": "2025-12-30T..."
  }
}
```

#### 3. Get Current User

```http
GET /api/auth/me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active"
  }
}
```

#### 4. Logout

```http
POST /api/auth/logout

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

### User Management Endpoints

#### 5. Get User Profile

```http
GET /api/users/profile
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active"
  }
}
```

#### 6. Update Profile

```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "John Updated",
  "email": "john.updated@example.com"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### 7. Change Password

```http
PUT /api/users/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}

Response (200):
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Admin Endpoints

#### 8. Get All Users (Admin Only)

```http
GET /api/users?page=1&limit=10
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "count": 10,
  "total": 25,
  "page": 1,
  "pages": 3,
  "users": [
    {
      "id": "user_id",
      "fullName": "User Name",
      "email": "user@example.com",
      "role": "user",
      "status": "active",
      "createdAt": "2025-12-30T..."
    },
    ...
  ]
}
```

#### 9. Activate User (Admin Only)

```http
PATCH /api/users/:id/activate
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "message": "User activated successfully",
  "user": { ... }
}
```

#### 10. Deactivate User (Admin Only)

```http
PATCH /api/users/:id/deactivate
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "message": "User deactivated successfully",
  "user": { ... }
}
```

### Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description here"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## 🧪 Testing

The backend includes comprehensive unit tests using Jest and Supertest.

### Running Tests

```bash
cd backend
npm test
```

### Test Coverage

- **21 passing tests** covering:
  - User signup (3 tests)
  - User login (3 tests)
  - Get current user (3 tests)
  - User profile management (2 tests)
  - Profile updates (2 tests)
  - Admin user listing with pagination (3 tests)
  - User activation/deactivation (3 tests)
  - Password change functionality (2 tests)

### Test Files

- `backend/__tests__/auth.test.js` - Authentication tests
- `backend/__tests__/user.test.js` - User management tests

## 🚀 Deployment Instructions

### Backend Deployment (Render/Railway)

1. **Create a new Web Service** on Render or Railway
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
4. **Add environment variables:**
   - `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `NODE_ENV=production`
5. **Deploy** and note your backend URL

### Frontend Deployment (Vercel/Netlify)

1. **Create a new project** on Vercel or Netlify
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Update API base URL** in `frontend/src/services/api.js` to your deployed backend URL
5. **Deploy** and note your frontend URL

### Database (MongoDB Atlas)

1. **Create a cluster** on MongoDB Atlas
2. **Create a database user** with read/write permissions
3. **Whitelist IP addresses** (or allow all for testing: `0.0.0.0/0`)
4. **Get connection string** and add to backend environment variables

## 📸 Screenshots

[Add screenshots of your application here]

## 🎥 Walkthrough Video

[Video Link - Coming Soon]

A 3-5 minute screen-recorded walkthrough demonstrating:

- User signup and login
- Role-based access control
- User profile management
- Admin dashboard features
- User activation/deactivation
- Responsive design
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
