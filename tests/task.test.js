// tests/task.test.js - Tests for task operations

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Task = require('../models/Task');

let testUser;
let agent;

// Connect to test database
beforeAll(async () => {
  const testDbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-test';
  await mongoose.connect(testDbUri);
});

// Set up test user before each test
beforeEach(async () => {
  // Clear database
  await User.deleteMany({});
  await Task.deleteMany({});

  // Create test user
  testUser = await User.create({
    username: 'testUser',
    password: 'password123'
  });

  // Create authenticated session
  agent = request.agent(app);
  await agent
    .post('/auth/login')
    .send({
      username: 'testUser',
      password: 'password123'
    });
});

// Close connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Task Tests', () => {

  // Test: Create new task
  test('Should create a new task', async () => {
    const response = await agent
      .post('/tasks')
      .send({
        title: 'Test Task'
      });

    expect(response.status).toBe(302); // Redirect

    const task = await Task.findOne({ title: 'Test Task' });
    expect(task).toBeTruthy();
    expect(task.status).toBe('pending');
    expect(task.userId.toString()).toBe(testUser._id.toString());
  });

  // Test: Get all tasks
  test('Should get all user tasks', async () => {
    // Create some tasks
    await Task.create([
      { title: 'Task 1', userId: testUser._id },
      { title: 'Task 2', userId: testUser._id, status: 'completed' }
    ]);

    const response = await agent.get('/tasks');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Task 1');
    expect(response.text).toContain('Task 2');
  });

  // Test: Filter pending tasks
  test('Should filter pending tasks', async () => {
    await Task.create([
      { title: 'Pending Task', userId: testUser._id, status: 'pending' },
      { title: 'Completed Task', userId: testUser._id, status: 'completed' }
    ]);

    const response = await agent.get('/tasks?filter=pending');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Pending Task');
    expect(response.text).not.toContain('Completed Task');
  });

  // Test: Complete a task
  test('Should mark task as completed', async () => {
    const task = await Task.create({
      title: 'Test Task',
      userId: testUser._id,
      status: 'pending'
    });

    const response = await agent.post(`/tasks/${task._id}/complete`);

    expect(response.status).toBe(302);

    const updatedTask = await Task.findById(task._id);
    expect(updatedTask.status).toBe('completed');
  });

  // Test: Delete a task
  test('Should delete a task', async () => {
    const task = await Task.create({
      title: 'Test Task',
      userId: testUser._id
    });

    const response = await agent.post(`/tasks/${task._id}/delete`);

    expect(response.status).toBe(302);

    const deletedTask = await Task.findById(task._id);
    expect(deletedTask.status).toBe('deleted');
  });

  // Test: User can only access their own tasks
  test('Should only show user their own tasks', async () => {
    // Create another user
    const otherUser = await User.create({
      username: 'otherUser',
      password: 'password123'
    });

    // Create tasks for both users
    await Task.create([
      { title: 'My Task', userId: testUser._id },
      { title: 'Other User Task', userId: otherUser._id }
    ]);

    const response = await agent.get('/tasks');

    expect(response.text).toContain('My Task');
    expect(response.text).not.toContain('Other User Task');
  });

  // Test: Redirect to login if not authenticated
  test('Should redirect to login if not authenticated', async () => {
    const unauthenticatedAgent = request.agent(app);
    
    const response = await unauthenticatedAgent.get('/tasks');

    expect(response.status).toBe(302);
    expect(response.header.location).toBe('/auth/login');
  });

});
