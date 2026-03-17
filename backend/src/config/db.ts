import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/career_guidance_db';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log('MongoDB connection successful (Atlas/Local)');
  } catch (error) {
    console.error('Primary DB connection error:', error instanceof Error ? error.message : error);
    console.log('Falling back to in-memory database...');
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('MongoDB connection successful (In-Memory)');
    } catch (memError) {
      console.error('Failed to start in-memory MongoDB:', memError);
      process.exit(1);
    }
  }
};

