import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect('mongodb+srv://admin:itiAmazon@cluster0.ke6bvtv.mongodb.net/parcels-test');
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Truck API', () => {
  it('should create a truck via API', async () => {
    const res = await request(app).post('/api/trucks');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id');
  });
});
