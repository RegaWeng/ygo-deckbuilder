const request = require('supertest');
const app = require('../app.js');
const pool = require('../db.js');
const mongoose = require('mongoose');

test('GET /health returns dependency status', async () => {
    const res = await request(app).get('/health');
    expect([200, 503]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('postgres');
    expect(res.body).toHaveProperty('mongo');
});

afterAll(async () => {
    await pool.end();
    await mongoose.connection.close();
});