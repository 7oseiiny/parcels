import mongoose from 'mongoose';
import { TruckService } from '../src/services/truck.service';
import { Parcel } from '../src/models/parcel.model';

beforeAll(async () => {
  await mongoose.connect('mongodb+srv://admin:itiAmazon@cluster0.ke6bvtv.mongodb.net/parcels-test');
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('TruckService', () => {
  it('should create a truck', async () => {
    const truck = await TruckService.createTruck();
    expect(truck).toHaveProperty('_id');
    expect(truck.parcels.length).toBe(0);
  });
});
