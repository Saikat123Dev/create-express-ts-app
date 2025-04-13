import { Response } from 'express';

interface SuccessResponse<T> {
    status: 'success';
    data: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        [key: string]: any;
    };
}

interface ErrorResponse {
    status: 'error';
    message: string;
    errors?: any[];
    code?: string;
}

export const sendSuccess = <T>(
    res: Response,
    data: T,
    statusCode = 200,
    meta?: SuccessResponse<T>['meta']
): Response<SuccessResponse<T>> => {
    return res.status(statusCode).json({
        status: 'success',
        data,
        ...(meta && { meta }),
    });
};

export const sendError = (
    res: Response,
    message: string,
    statusCode = 500,
    errors?: any[],
    code?: string
): Response<ErrorResponse> => {
    return res.status(statusCode).json({
        status: 'error',
        message,
        ...(errors && { errors }),
        ...(code && { code }),
    });
};

export const sendCreated = <T>(res: Response, data: T): Response<SuccessResponse<T>> => {
    return sendSuccess(res, data, 201);
};

export const sendNoContent = (res: Response): Response => {
    return res.status(204).send();
};