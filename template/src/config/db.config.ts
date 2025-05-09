import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/app_database');
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error connecting to MongoDB: ${error.message}`);
        } else {
            logger.error('Unknown error connecting to MongoDB');
        }
        process.exit(1);
    }
};