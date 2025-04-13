import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db.config';
import { logger } from './utils/logger';
import { appConfig } from './config/app.config';

const PORT = appConfig.port;

// Connect to MongoDB if enabled
if (appConfig.enableDatabase) {
    connectDB();
}

// Start the server
const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    logger.error('Unhandled Rejection:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});

export default server;