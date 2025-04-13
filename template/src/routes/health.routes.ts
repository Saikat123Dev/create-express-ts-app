import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @route GET /api/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'API is operational',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

export default router;