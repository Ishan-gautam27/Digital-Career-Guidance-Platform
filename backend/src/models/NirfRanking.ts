import mongoose, { Schema, Document } from 'mongoose';

export interface INirfRanking extends Document {
  collegeName: string;
  year: number;
  rank: number;
  score: number;
  category: string;
  city: string;
  state: string;
}

const NirfRankingSchema = new Schema<INirfRanking>(
  {
    collegeName: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    rank: { type: Number, required: true },
    score: { type: Number, default: 0 },
    category: { type: String, required: true, index: true },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
  },
  { timestamps: true }
);

// Compound index for efficient lookups
NirfRankingSchema.index({ year: 1, category: 1, rank: 1 });
NirfRankingSchema.index({ collegeName: 1, year: 1, category: 1 }, { unique: true });

export default mongoose.model<INirfRanking>('NirfRanking', NirfRankingSchema);
