import mongoose from 'mongoose';

const ParcelSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true
  },
  truckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Truck',
    default: null
  }
});

export const Parcel = mongoose.model('Parcel', ParcelSchema);