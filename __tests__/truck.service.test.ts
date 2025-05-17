import mongoose from 'mongoose';
import { TruckService } from '../src/services/truck.service';
import { ParcelService } from '../src/services/parcel.service';

beforeAll(async () => {
  await mongoose.connect('mongodb+srv://admin:itiAmazon@cluster0.ke6bvtv.mongodb.net/parcels-test');
});

afterAll(async () => {
  await mongoose.connection.collection('trucks').deleteMany({});
  await mongoose.connection.collection('parcels').deleteMany({});
  await mongoose.disconnect();
});

describe('TruckService', () => {
  let truckId: string;
  let parcelId: string;

  afterEach(async () => {
    // await mongoose.connection.collection('trucks').deleteMany({});
    // await mongoose.connection.collection('parcels').deleteMany({});
  });

  it('should create a truck', async () => {
    const truck = await TruckService.createTruck();
    expect(truck).toHaveProperty('_id');
    expect(truck.parcels.length).toBe(0);
    truckId = (truck._id as any).toString();
  });

  it('should get all trucks', async () => {
    await TruckService.createTruck();
    const trucks = await TruckService.getTruck();
    expect(Array.isArray(trucks)).toBe(true);
    expect(trucks.length).toBeGreaterThan(0);
  });

  it('should load a parcel into a truck', async () => {
    const truck = await TruckService.createTruck();
    truckId = (truck._id as any).toString();
    const parcel = await ParcelService.createParcel(5);
    parcelId = (parcel._id as any).toString();
    const updatedTruck = await TruckService.loadParcel(truckId, parcelId);
    expect(updatedTruck).not.toBeNull();
    expect((updatedTruck as any).parcels.map((id: any) => id.toString())).toContain(parcelId);
  });

  it('should return null when loading a non-existent parcel', async () => {
    const truck = await TruckService.createTruck();
    truckId = (truck._id as any).toString();
    const result = await TruckService.loadParcel(truckId, '000000000000000000000000');
    expect(result).toBeNull();
  });

  it('should unload a parcel from a truck', async () => {
    const truck = await TruckService.createTruck();
    truckId = (truck._id as any).toString();
    const parcel = await ParcelService.createParcel(7);
    parcelId = (parcel._id as any).toString();
    await TruckService.loadParcel(truckId, parcelId);
    const updatedTruck = await TruckService.unloadParcel(truckId, parcelId);
    expect(updatedTruck).not.toBeNull();
    expect((updatedTruck as any).parcels.map((id: any) => id.toString())).not.toContain(parcelId);
  });

  it('should return null when unloading a non-existent parcel', async () => {
    const truck = await TruckService.createTruck();
    truckId = (truck._id as any).toString();
    const result = await TruckService.unloadParcel(truckId, '000000000000000000000000');
    expect(result).toBeNull();
  });

  it('should get truck summary', async () => {
    const truck = await TruckService.createTruck();
    truckId = (truck._id as any).toString();
    const parcel = await ParcelService.createParcel(10);
    parcelId = (parcel._id as any).toString();
    await TruckService.loadParcel(truckId, parcelId);
    const summary = await TruckService.getTruckSummary(truckId);
    expect(summary).not.toBeNull();
    expect(summary).toHaveProperty('truckId');
    expect(summary).toHaveProperty('parcelCount', 1);
    expect(summary).toHaveProperty('totalWeight', 10);
  });

  it('should return null for truck summary if truck not found', async () => {
    const summary = await TruckService.getTruckSummary('000000000000000000000000');
    expect(summary).toBeNull();
  });
});
