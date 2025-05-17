// Common TypeScript interfaces for Mongoose models
import { Types, Document } from 'mongoose';

export interface IParcel extends Document {
    weight: number;
    truckId: Types.ObjectId | null;
}

export interface ITruck extends Document {
    parcels: Types.ObjectId[] | IParcel[];
}

export interface TruckSummary {
    truckId: Types.ObjectId;
    parcelCount: number;
    totalWeight: number;
}
