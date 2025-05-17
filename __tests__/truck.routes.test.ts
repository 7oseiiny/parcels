import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';

beforeAll(async () => {
    await mongoose.connect('mongodb+srv://admin:itiAmazon@cluster0.ke6bvtv.mongodb.net/parcels-test');
});

afterAll(async () => {
    await mongoose.connection.collection('trucks').deleteMany({});
    await mongoose.connection.collection('parcels').deleteMany({});
    await mongoose.disconnect();
});

describe('Truck API', () => {

    afterEach(async () => {
        // Clean up trucks and parcels after each test
       
    });

    it('should create a truck via API', async () => {
        const res = await request(app).post('/api/trucks');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('_id');
    });

    it('should get all trucks', async () => {
        await request(app).post('/api/trucks');
        const res = await request(app).get('/api/trucks');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should create a parcel and load it into a truck', async () => {
        const truckRes = await request(app).post('/api/trucks');
        const truckId = truckRes.body._id;
        const parcelRes = await request(app).post('/api/parcels').send({ weight: 5 });
        const parcelId = parcelRes.body._id;
        const loadRes = await request(app).post(`/api/trucks/${truckId}/load/${parcelId}`);
        expect(loadRes.status).toBe(200);
        expect(loadRes.body.parcels).toContain(parcelId);
    });

    it('should unload a parcel from a truck', async () => {
        const truckRes = await request(app).post('/api/trucks');
        const truckId = truckRes.body._id;
        const parcelRes = await request(app).post('/api/parcels').send({ weight: 7 });
        const parcelId = parcelRes.body._id;
        await request(app).post(`/api/trucks/${truckId}/load/${parcelId}`);
        const unloadRes = await request(app).post(`/api/trucks/${truckId}/unload/${parcelId}`);
        expect(unloadRes.status).toBe(200);
        expect(unloadRes.body.parcels).not.toContain(parcelId);
    });

    it('should get truck summary', async () => {
        const truckRes = await request(app).post('/api/trucks');
        const truckId = truckRes.body._id;
        const parcelRes = await request(app).post('/api/parcels').send({ weight: 10 });
        const parcelId = parcelRes.body._id;
        await request(app).post(`/api/trucks/${truckId}/load/${parcelId}`);
        const summaryRes = await request(app).get(`/api/trucks/${truckId}/summary`);
        expect(summaryRes.status).toBe(200);
        expect(summaryRes.body).toHaveProperty('truckId');
        expect(summaryRes.body).toHaveProperty('parcelCount', 1);
        expect(summaryRes.body).toHaveProperty('totalWeight', 10);
    });

    it('should return 404 for loading non-existent parcel', async () => {
        const truckRes = await request(app).post('/api/trucks');
        const truckId = truckRes.body._id;
        const res = await request(app).post(`/api/trucks/${truckId}/load/000000000000000000000000`);
        expect(res.status).toBe(404);
    });

    it('should return 404 for unloading non-existent parcel', async () => {
        const truckRes = await request(app).post('/api/trucks');
        const truckId = truckRes.body._id;
        const res = await request(app).post(`/api/trucks/${truckId}/unload/000000000000000000000000`);
        expect(res.status).toBe(404);
    });

    it('should return 404 for truck summary if truck not found', async () => {
        const res = await request(app).get(`/api/trucks/000000000000000000000000/summary`);
        expect(res.status).toBe(404);
    });
});
