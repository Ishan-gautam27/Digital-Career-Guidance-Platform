import mongoose, { Schema, Document } from 'mongoose';

export interface ICollege extends Document {
  name: string;
  state: string;
  city: string;
  website: string;
  type: string;
  courses: string[];
  feesRange: {
    min: number;
    max: number;
    currency: string;
  };
  admissionDetails: string;
  placementStats: {
    averagePackage: string;
    highestPackage: string;
    placementRate: string;
    topRecruiters: string[];
  };
  nirfRanking: {
    rank: number;
    score: number;
    year: number;
    category: string;
  };
  openAlexData: {
    openAlexId: string;
    citedByCount: number;
    worksCount: number;
    hIndex: number;
    topics: string[];
  };
  domains: string[];
  sources: string[];
  lastUpdated: Date;
}

const CollegeSchema = new Schema<ICollege>(
  {
    name: { type: String, required: true, index: true },
    state: { type: String, default: '', index: true },
    city: { type: String, default: '' },
    website: { type: String, default: '' },
    type: { type: String, default: 'university', enum: ['university', 'college', 'institute', 'other'] },
    courses: [{ type: String }],
    feesRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
    },
    admissionDetails: { type: String, default: '' },
    placementStats: {
      averagePackage: { type: String, default: '' },
      highestPackage: { type: String, default: '' },
      placementRate: { type: String, default: '' },
      topRecruiters: [{ type: String }],
    },
    nirfRanking: {
      rank: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
      year: { type: Number, default: 0 },
      category: { type: String, default: '' },
    },
    openAlexData: {
      openAlexId: { type: String, default: '' },
      citedByCount: { type: Number, default: 0 },
      worksCount: { type: Number, default: 0 },
      hIndex: { type: Number, default: 0 },
      topics: [{ type: String }],
    },
    domains: [{ type: String }],
    sources: [{ type: String }],
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Text index for search
CollegeSchema.index({ name: 'text', state: 'text', city: 'text', courses: 'text' });

export default mongoose.model<ICollege>('College', CollegeSchema);
