const request = require('supertest');
const app = require('../index');
const { connectDB, closeDB } = require('./setup');

describe('Health Check', () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await closeDB();
    });

    it('should return 200 and server status', async () => {
        const res = await request(app).get('/');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toBe('Server is running!');
        expect(res.body.endpoints).toBeDefined();
    });
});
