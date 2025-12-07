const request = require('supertest');
const app = require('../index');
const { connectDB, closeDB, clearDB } = require('./setup');
const User = require('../models/User');

describe('User Creation Endpoint (POST /api/users)', () => {

    // Connect to in-memory DB before tests run
    beforeAll(async () => {
        await connectDB();
    });

    // Close connection after tests finish
    afterAll(async () => {
        await closeDB();
    });

    // Clear the database between each test to ensure isolation
    afterEach(async () => {
        await clearDB();
    });

    it('should successfully create a new user', async () => {
        const userData = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123'
        };

        const res = await request(app)
            .post('/api/users')
            .send(userData);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('UserID');

        // Verify user is actually in the database
        const user = await User.findOne({ email: userData.email });
        expect(user).toBeTruthy();
        expect(user.username).toBe(userData.username);
    });

    it('should return 400 if email already exists', async () => {
        // Create initial user
        const initialUserData = {
            email: 'duplicate@example.com',
            username: 'originalUser',
            password: 'password123'
        };

        await request(app)
            .post('/api/users')
            .send(initialUserData)

        // Attempt to create another user with same email
        const duplicateData = {
            email: 'duplicate@example.com',
            username: 'newUser',
            password: 'password123'
        };

        const res = await request(app)
            .post('/api/users')
            .send(duplicateData);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toMatch(/Account already exists/);
    });

    it('should return 400 if username already exists', async () => {
        // Create initial user
        const initialUserData = {
            email: 'duplicate@example.com',
            username: 'originalUser',
            password: 'password123'
        };

        await request(app)
            .post('/api/users')
            .send(initialUserData);

        // Attempt to create another user with same username
        const duplicateData = {
            email: 'user2@example.com',
            username: 'originalUser',
            password: 'password123'
        };

        const res = await request(app)
            .post('/api/users')
            .send(duplicateData);

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toMatch(/Username already in use/);
    });

    it('should handle database errors gracefully', async () => {
        // This test attempts to create a user with missing required fields (like email/username)
        // Since the mongoose model requires them, it should fail
        const invalidData = {
            password: 'password123'
        };

        const res = await request(app)
            .post('/api/users')
            .send(invalidData);

        // The controller catches the error and returns 400 with the error message
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBeDefined();
    });
});
