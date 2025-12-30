require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

// Test database connection
beforeAll(async () => {
  const testDbUrl = process.env.MONGODB_URI_TEST || process.env.MONGODB_URI;
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(testDbUrl);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({ email: /test.*@example\.com/ });
});

describe('User Management Tests', () => {
  let userToken;
  let adminToken;
  let testUserId;

  beforeEach(async () => {
    // Create a regular user
    const user = await User.create({
      fullName: 'Regular User',
      email: 'testregular@example.com',
      password: 'password123',
      role: 'user'
    });
    testUserId = user._id;

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testregular@example.com',
        password: 'password123'
      });
    userToken = userLogin.body.token;

    // Create an admin user
    await User.create({
      fullName: 'Admin User',
      email: 'testadmin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testadmin@example.com',
        password: 'admin123'
      });
    adminToken = adminLogin.body.token;
  });

  // Test 4: Get User Profile
  describe('GET /api/users/profile', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('testregular@example.com');
      expect(response.body.user.password).toBeUndefined();
    });

    it('should not get profile without authentication', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  // Test 5: Update User Profile
  describe('PUT /api/users/profile', () => {
    it('should update user profile', async () => {
      const updateData = {
        fullName: 'Updated Name',
        email: 'testupdated@example.com'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.fullName).toBe('Updated Name');
      expect(response.body.user.email).toBe('testupdated@example.com');
    });

    it('should not update with duplicate email', async () => {
      // Try to update to admin's email
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          email: 'testadmin@example.com'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  // Test 6: Admin - Get All Users
  describe('GET /api/users - Admin Access', () => {
    it('should get all users with admin token', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users.length).toBeGreaterThan(0);
    });

    it('should not allow regular user to get all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('admin');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/users?page=1&limit=5')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.page).toBe(1);
      expect(response.body.pages).toBeDefined();
    });
  });

  // Test 7: Admin - Activate/Deactivate User
  describe('PATCH /api/users/:id/activate and /deactivate', () => {
    it('should allow admin to deactivate user', async () => {
      const response = await request(app)
        .patch(`/api/users/${testUserId}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.status).toBe('inactive');
    });

    it('should allow admin to activate user', async () => {
      // First deactivate
      await request(app)
        .patch(`/api/users/${testUserId}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`);

      // Then activate
      const response = await request(app)
        .patch(`/api/users/${testUserId}/activate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.status).toBe('active');
    });

    it('should not allow regular user to deactivate other users', async () => {
      const response = await request(app)
        .patch(`/api/users/${testUserId}/deactivate`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  // Test 8: Change Password
  describe('PUT /api/users/change-password', () => {
    it('should change password with correct current password', async () => {
      const response = await request(app)
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('changed');

      // Verify new password works
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testregular@example.com',
          password: 'newpassword456'
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });

    it('should not change password with wrong current password', async () => {
      const response = await request(app)
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword456'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('incorrect');
    });
  });
});
