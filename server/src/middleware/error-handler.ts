import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    keyValue?: any;
    errors?: Record<string, any>;
    value?: string;
}

const errorHandlerMiddleware = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later'
    };

    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )} field, please choose another value`;
        customError.statusCode = 400;
    }

    // if (err.name === 'ValidationError') {
    //     customError.msg = Object.values(err.errors)
    //         .map(item => item.message)
    //         .join(', ');
    //     customError.statusCode = 400;
    // }
    if (err.name === 'ValidationError') {
        customError.msg = err.errors
            ? Object.values(err.errors)
                  .map((item: any) => item.message)
                  .join(', ')
            : 'Validation error';
        customError.statusCode = 400;
    }

    if (err.name === 'CastError') {
        customError.msg = `No item found with ID: ${err.value}`;
        customError.statusCode = 404;
    }

    return res.status(customError.statusCode).json({ msg: customError.msg });
};

export { errorHandlerMiddleware };
