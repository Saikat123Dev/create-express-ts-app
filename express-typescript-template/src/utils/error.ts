export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    metadata?: Record<string, any>;

    constructor(message: string, statusCode: number, metadata?: Record<string, any>) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.metadata = metadata;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const handleDatabaseError = (error: any): AppError => {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => ({
            field: err.path,
            message: err.message,
        }));

        return new AppError('Validation Error', 400, { validationErrors });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return new AppError(`Duplicate field value: ${field}`, 400);
    }

    // Default database error
    return new AppError('Database Error', 500);
};

export const notFoundError = (resource: string): AppError => {
    return new AppError(`${resource} not found`, 404);
};

export const unauthorizedError = (): AppError => {
    return new AppError('Unauthorized access', 401);
};

export const forbiddenError = (): AppError => {
    return new AppError('Forbidden access', 403);
};