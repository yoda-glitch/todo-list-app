// tests/auth.test.js - Tests for authentication

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

// Connect to test database before tests
beforeAll(async () => {
  const testDbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-test';
  await mongoose.connect(testDbUri);
});

// Clear database after each test
afterEach(async () => {
  await User.deleteMany({});
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Authentication Tests', () => {
  
  // Test: Register new user
  test('Should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(response.status).toBe(302); // Redirect status
    
    const user = await User.findOne({ username: 'testuser' });
    expect(user).toBeTruthy();
    expect(user.username).toBe('testuser');
  });

  // Test: Reject duplicate username
  test('Should not register duplicate username', async () => {
    // Create first user
    await User.create({
      username: 'testuser',
      password: 'password123'
    });

    // Try to create duplicate
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        password: 'differentpass'
      });

    expect(response.status).toBe(200); // Shows register page with error
    expect(response.text).toContain('already exists');
  });

  // Test: Login with correct credentials
  test('Should login with correct credentials', async () => {
    // Create user first
    const user = await User.create({
      username: 'testuser',
      password: 'password123'
    });

    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(response.status).toBe(302); // Redirect to tasks
  });

  // Test: Reject wrong password
  test('Should not login with wrong password', async () => {
    // Create user
    await User.create({
      username: 'testuser',
      password: 'password123'
    });

    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(200); // Shows login page with error
    expect(response.text).toContain('Invalid');
  });

  // Test: Reject non-existent user
  test('Should not login non-existent user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'nonexistent',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.text).toContain('Invalid');
  });

});