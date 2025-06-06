import { Router, Request, Response } from 'express';
import { ParcelService } from '../services/parcel.service';
import { Parcel } from '../models/parcel.model';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { weight } = req.body;
    const parcel = await ParcelService.createParcel(weight);
    res.json(parcel);
  } catch (error) {
    res.status(500).json({ message: (error instanceof Error ? error.message : 'Unknown error') });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const parcels = await ParcelService.getParcels();
    res.json(parcels);
  } catch (error) {
    res.status(500).json({ message: (error instanceof Error ? error.message : 'Unknown error') });
  }
});

router.delete('/', async (req: Request, res: Response) => {
  try {
    await Parcel.deleteMany({});
    res.json({ message: 'All parcels deleted' });
  } catch (error) {
    res.status(500).json({ message: (error instanceof Error ? error.message : 'Unknown error') });
  }
});

export default router;
