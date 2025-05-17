import { Truck } from '../models/truck.model';
import { Parcel } from '../models/parcel.model';
import { ITruck, IParcel, TruckSummary } from '../types/models';
import { Types } from 'mongoose';

export const TruckService = {
  async createTruck(): Promise<ITruck> {
    try {
      const truck = new Truck({ parcels: [] });
      await truck.save();
      return truck as ITruck;
    } catch (error) {
      throw new Error('Error creating truck: ' + (error instanceof Error ? error.message : error));
    }
  },

  async getTruck(): Promise<ITruck[]> {
    try {
      return await Truck.find() as ITruck[];
    } catch (error) {
      throw new Error('Error fetching trucks: ' + (error instanceof Error ? error.message : error));
    }
  },

  async loadParcel(truckId: string, parcelId: string): Promise<ITruck | null> {
    try {
      const parcel = await Parcel.findById(parcelId) as IParcel | null;
      if (!parcel) return null;
      const truck = await Truck.findOneAndUpdate(
        { _id: truckId },
        { $addToSet: { parcels: parcel._id } },
        { new: true }
      ) as ITruck | null;
      parcel.truckId = truckId as unknown as IParcel['truckId'];
      await parcel.save();
      return truck;
    } catch (error) {
      throw new Error('Error loading parcel: ' + (error instanceof Error ? error.message : error));
    }
  },

  async unloadParcel(truckId: string, parcelId: string): Promise<ITruck | null> {
    try {
      const parcel = await Parcel.findById(parcelId) as IParcel | null;
      if (!parcel) return null;
      const truck = await Truck.findOneAndUpdate(
        { _id: truckId },
        { $pull: { parcels: parcel._id } },
        { new: true }
      ) as ITruck | null;
      parcel.truckId = null;
      await parcel.save();
      return truck;
    } catch (error) {
      throw new Error('Error unloading parcel: ' + (error instanceof Error ? error.message : error));
    }
  },

  async getTruckSummary(truckId: string): Promise<TruckSummary | null> {
    try {
      const truck = await Truck.findById(truckId).populate('parcels') as ITruck | null;
      if (!truck) return null;
      const parcels = truck.parcels as IParcel[];
      const totalWeight = parcels.reduce((sum, p) => sum + p.weight, 0);
      return {
        truckId: truck._id as Types.ObjectId,
        parcelCount: parcels.length,
        totalWeight,
      };
    } catch (error) {
      throw new Error('Error getting truck summary: ' + (error instanceof Error ? error.message : error));
    }
  }
};
