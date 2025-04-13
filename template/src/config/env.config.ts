import { z } from 'zod';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

// Define schema for environment variables
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(val => parseInt(val, 10)).default('5000'),
    API_PREFIX: z.string().default('/api'),
    ENABLE_DATABASE: z.string().transform(val => val === 'true').default('true'),
    MONGODB_URI: z.string().optional(),
    JWT_SECRET: z.string().min(8),
    JWT_EXPIRE: z.string().default('30d'),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Validate environment variables
export const validateEnv = (): void => {
    try {
        envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missingVars = error.errors.map(e => e.path.join('.'));
            logger.error(`Missing or invalid environment variables: ${missingVars.join(', ')}`);
            process.exit(1);
        }
    }
};