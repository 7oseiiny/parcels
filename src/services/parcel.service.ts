// src/services/parcel.service.ts
import { Parcel } from '../models/parcel.model';
import { IParcel } from '../types/models';

export const ParcelService = {
  async createParcel(weight: number): Promise<IParcel> {
    try {
      const parcel = new Parcel({ weight });
      await parcel.save();
      return parcel as IParcel;
    } catch (error) {
      throw new Error('Error creating parcel: ' + (error instanceof Error ? error.message : error));
    }
  },

  async getParcelById(id: string): Promise<IParcel | null> {
    try {
      return await Parcel.findById(id) as IParcel | null;
    } catch (error) {
      throw new Error('Error fetching parcel by id: ' + (error instanceof Error ? error.message : error));
    }
  },

  async getParcels(): Promise<IParcel[]> {
    try {
      return await Parcel.find() as IParcel[];
    } catch (error) {
      throw new Error('Error fetching parcels: ' + (error instanceof Error ? error.message : error));
    }
  }
};
