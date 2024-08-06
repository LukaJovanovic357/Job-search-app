import { describe, it, expect } from 'vitest';
import { BadRequestError } from '../bad-request';
import { StatusCodes } from 'http-status-codes';

describe('BadRequestError', () => {
    it('should create an error with a message and status code 400', () => {
        const errorMessage = 'This is a bad request';
        const error = new BadRequestError(errorMessage);

        expect(error).toBeInstanceOf(BadRequestError);
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(errorMessage);
        expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should have a name property set to "Error"', () => {
        const error = new BadRequestError('Another bad request');
        expect(error.name).toBe('Error');
    });
});
