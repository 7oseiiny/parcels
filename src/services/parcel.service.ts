// src/services/parcel.service.ts
import { Parcel } from '../models/parcel.model';
import { IParcel } from '../types/models';

export const ParcelService = {
  async createParcel(weight: number): Promise<IParcel> {
    const parcel = new Parcel({ weight });
    await parcel.save();
    return parcel as IParcel;
  },

  async getParcelById(id: string): Promise<IParcel | null> {
    return Parcel.findById(id) as Promise<IParcel | null>;
  },

  async getParcels(): Promise<IParcel[]> {
    return Parcel.find() as Promise<IParcel[]>;
  }
};
