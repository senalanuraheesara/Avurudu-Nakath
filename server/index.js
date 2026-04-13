import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { nakathSchema } from './models/NakathEvent.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const Nakath = mongoose.model('NakathEvent', nakathSchema, 'nakath_events');

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'avurudu-api' });
});

app.get('/api/nakath/events', async (_req, res) => {
  try {
    const docs = await Nakath.find().sort({ order: 1 }).lean();
    res.json(docs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to load events' });
  }
});

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/avurudu';
const port = Number(process.env.PORT) || 4000;
/** Bind all interfaces so Docker / AWS (App Runner, ECS, EB) can route traffic in. */
const host = process.env.HOST || '0.0.0.0';

mongoose
  .connect(uri)
  .then(() => {
    app.listen(port, host, () => {
      console.log(`Avurudu API listening on http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
