// src/services/parcel.service.ts
import { Parcel } from '../models/parcel.model';

export const ParcelService = {
  async createParcel(weight: number) {
    const parcel = new Parcel({ weight });
    await parcel.save();
    return parcel;
  },

  async getParcelById(id: string) {
    return Parcel.findById(id);
  },

  async getParcels() {
    return Parcel.find();
  }
};
