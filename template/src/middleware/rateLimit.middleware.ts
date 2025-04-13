import rateLimit from 'express-rate-limit';
import { appConfig } from '../config/app.config';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    skip: () => appConfig.nodeEnv === 'test', // Skip in test environment
});

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login requests per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Too many login attempts from this IP, please try again after an hour'
    },
    skip: () => appConfig.nodeEnv === 'test',
});