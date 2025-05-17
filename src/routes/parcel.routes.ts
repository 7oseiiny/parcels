import { Router, Request, Response } from 'express';
import { ParcelService } from '../services/parcel.service';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { weight } = req.body;
  const parcel = await ParcelService.createParcel(weight);
  res.json(parcel);
});

router.get('/', async (req: Request, res: Response) => {
  const parcels = await ParcelService.getParcels();
  res.json(parcels);
});

export default router;
