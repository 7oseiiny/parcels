// src/services/truck.service.ts
import { Truck } from '../models/truck.model';
import { Parcel } from '../models/parcel.model';
import mongoose from 'mongoose';

export const TruckService = {
  async createTruck() {
    const truck = new Truck({ parcels: [] });
    await truck.save();
    return truck;
  },

  async getTruck() {
   return Truck.find();
  },

  async loadParcel(truckId: string, parcelId: string) {
    try {

      const parcel = await Parcel.findById(parcelId);
      if (!parcel) return null;

      let truck = await Truck.findOneAndUpdate(
        { _id: truckId },
        { $addToSet: { parcels: parcel._id } },
        { new: true }
      );
      parcel.truckId = truckId as any
      await parcel.save();
      return truck;

    } catch (error) {
      return 'Error loading parcel' + error;
    }
  },

  async unloadParcel(truckId: string, parcelId: string) {
    try {
      const parcel = await Parcel.findById(parcelId);
      if (!parcel) return null;

      let truck = await Truck.findOneAndUpdate(
        { _id: truckId },
        { $pull: { parcels: parcel._id } },
        { new: true }
      );
      parcel.truckId = null as any;
      await parcel.save();
      return truck;
    } catch (error) {
      return 'Error unloading parcel' + error;
    }
  },

  async getTruckSummary(truckId: string) {
    const truck = await Truck.findById(truckId).populate('parcels');
    if (!truck) return null;

    const totalWeight = (truck.parcels as any[]).reduce((sum, p) => sum + p.weight, 0);

    return {
      truckId: truck._id,
      parcelCount: truck.parcels.length,
      totalWeight,
    };
  }
};
