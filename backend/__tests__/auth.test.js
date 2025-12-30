require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

// Test database connection
beforeAll(async () => {
  // Use a test database URL
  const testDbUrl = process.env.MONGODB_URI_TEST || process.env.MONGODB_URI;
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(testDbUrl);
  }
});

// Clean up after tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Clear test data before each test
beforeEach(async () => {
  await User.deleteMany({ email: /test.*@example\.com/ });
});

describe('Authentication Tests', () => {
  
  // Test 1: User Signup
  describe('POST /api/auth/signup', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'testuser@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.fullName).toBe(userData.fullName);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned
    });

    it('should not allow duplicate email registration', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'testduplicate@example.com',
        password: 'password123'
      };

      // First signup
      await request(app)
        .post('/api/auth/signup')
        .send(userData);

      // Try to signup again with same email
      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'incomplete@example.com'
          // Missing fullName and password
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  // Test 2: User Login
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await User.create({
        fullName: 'Login Test User',
        email: 'testlogin@example.com',
        password: 'password123',
        role: 'user'
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testlogin@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('testlogin@example.com');
      expect(response.body.token).toBeDefined();
    });

    it('should not login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testlogin@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  // Test 3: Get Current User
  describe('GET /api/auth/me', () => {
    let token;

    beforeEach(async () => {
      // Create and login a user
      const user = await User.create({
        fullName: 'Auth Test User',
        email: 'testauth@example.com',
        password: 'password123',
        role: 'user'
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testauth@example.com',
          password: 'password123'
        });

      token = loginResponse.body.token;
    });

    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('testauth@example.com');
    });

    it('should not get user without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('token');
    });

    it('should not get user with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken123')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
