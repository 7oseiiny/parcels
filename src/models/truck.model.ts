import mongoose from 'mongoose';

const TruckSchema = new mongoose.Schema({
  parcels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parcel'
    }
  ]
});

export const Truck = mongoose.model('Truck', TruckSchema);