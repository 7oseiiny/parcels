import express from 'express';
import parcelRoutes from './routes/parcel.routes';
import truckRoutes from './routes/truck.routes';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('wellcome to the express server');
});

app.use('/api/parcels', parcelRoutes);
app.use('/api/trucks', truckRoutes);

export default app;
