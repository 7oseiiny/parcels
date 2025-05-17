import { Router, Request, Response } from 'express';
import { TruckService } from '../services/truck.service';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const truck = await TruckService.createTruck();
  res.json(truck);
});

router.get('/', async (req: Request, res: Response) => {
  const truck = await TruckService.getTruck();
  res.json(truck);
});

router.post('/:truckId/load/:parcelId', async (req: Request, res: Response) => {
  const { truckId, parcelId } = req.params;
  const truck = await TruckService.loadParcel(truckId, parcelId);
  if (!truck) return res.status(404).json({ message: 'Truck or Parcel not found' });
  res.json(truck);
});

router.post('/:truckId/unload/:parcelId', async (req: Request, res: Response) => {
  const { truckId, parcelId } = req.params;
  const truck = await TruckService.unloadParcel(truckId, parcelId);
  if (!truck) return res.status(404).json({ message: 'Truck or Parcel not found' });
  res.json(truck);
});

router.get('/:truckId/summary', async (req: Request, res: Response) => {
  const { truckId } = req.params;
  const summary = await TruckService.getTruckSummary(truckId);
  if (!summary) return res.status(404).json({ message: 'Truck not found' });
  res.json(summary);
});

export default router;
