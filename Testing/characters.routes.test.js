require('dotenv').config(); // loads JWT_SECRET (and MONGO_URI, unused here) from .env into process.env
const mongoose = require('mongoose'); // only used for the afterAll cleanup line below
const jwt = require('jsonwebtoken'); // used to sign a real token for the "authenticated" test
const request = require('supertest'); // fires fake HTTP requests at the Express app, no real port needed

const characterModel = require('../models/character'); 
const app = require('../app'); // the real Express app — routes, middleware, controllers untouched

const seedCharacters = [
    { name: 'TEST_Aria', gender: 'F', power: 20 },
    {  name: 'TEST_Bolt', gender: 'M', power: 15 },
];

// A genuinely valid JWT, signed with the real secret — auth itself is not faked
const validToken = jwt.sign({ accountId: 'test-account' }, process.env.JWT_SECRET, { expiresIn: '15m' });

beforeAll(async ()=> {
    await mongoose.connect(process.env.MONGO_URI);
});

let seededDocs;

beforeEach(async () => {
    await characterModel.deleteMany({ name: { $regex: '^TEST_' } }); // clears only leftover test docs, nothing else
    seededDocs = await characterModel.insertMany(seedCharacters); // real documents now exist in Mongo
});

afterAll(async () => {
    await characterModel.deleteMany({ name: { $regex: '^TEST_' } }); // leaves nothing behind
    await mongoose.connection.close();
});


test('GET / returns 200 with JSON content-type', async () => {
    const response = await request(app).get('/'); 
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/); // set automatically by res.json()
});

test('POST /characters with a valid body and auth returns 201', async () => {
    const response = await request(app)
        .post('/characters')
        .set('Authorization', `Bearer ${validToken}`) // passes requireAuth
        .send({ name: 'TEST_Gizmo', gender: 'M', power: 12 }); 

    expect(response.status).toBe(201);
});

test('POST /characters without an auth header returns 401', async () => {
    const response = await request(app)
        .post('/characters')
        .send({ name: 'Gizmo', gender: 'M', power: 12 }); 

    expect(response.status).toBe(401);
});

test('POST /characters with an invalid body returns 400', async () => {
    const response = await request(app)
        .post('/characters')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ gender: 'M', power: 12 }); 
    expect(response.status).toBe(400);
});

test('GET /characters/:id with an unknown id returns 404', async () => {
    const response = await request(app).get('/characters/does-not-exist'); 
    expect(response.status).toBe(404);
});
