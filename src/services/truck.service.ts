import { Truck } from '../models/truck.model';
import { Parcel } from '../models/parcel.model';
import { ITruck, IParcel, TruckSummary } from '../types/models';
import { Types } from 'mongoose';

export const TruckService = {
  async createTruck(): Promise<ITruck> {
    const truck = new Truck({ parcels: [] });
    await truck.save();
    return truck as ITruck;
  },

  async getTruck(): Promise<ITruck[]> {
    return Truck.find() as Promise<ITruck[]>;
  },

  async loadParcel(truckId: string, parcelId: string): Promise<ITruck | null | string> {
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
      return 'Error loading parcel' + error;
    }
  },

  async unloadParcel(truckId: string, parcelId: string): Promise<ITruck | null | string> {
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
      return 'Error unloading parcel' + error;
    }
  },

  async getTruckSummary(truckId: string): Promise<TruckSummary | null> {
    const truck = await Truck.findById(truckId).populate('parcels') as ITruck | null;
    if (!truck) return null;
    const parcels = truck.parcels as IParcel[];
    const totalWeight = parcels.reduce((sum, p) => sum + p.weight, 0);
    return {
      truckId: truck._id as Types.ObjectId,
      parcelCount: parcels.length,
      totalWeight,
    };
  }
};
