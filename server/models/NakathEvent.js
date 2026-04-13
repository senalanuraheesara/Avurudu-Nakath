import mongoose from 'mongoose';

const extraDateSchema = new mongoose.Schema(
  {
    labelSi: String,
    labelEn: String,
    dateSi: String,
    at: String,
  },
  { _id: false },
);

export const nakathSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    order: { type: Number, required: true },
    titleSi: String,
    titleEn: String,
    kind: { type: String, enum: ['single', 'range', 'multi_date', 'date_only'] },
    startAt: String,
    endAt: String,
    extraDates: [extraDateSchema],
    detailsSi: String,
    detailsEn: String,
  },
  { collection: 'nakath_events' },
);
