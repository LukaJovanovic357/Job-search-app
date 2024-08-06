import { describe, it, expect } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../not-found';

describe('NotFoundError', () => {
    it('should create an error with a message and status code', () => {
        const errorMessage = 'Resource not found';
        const error = new NotFoundError(errorMessage);

        expect(error).toBeInstanceOf(NotFoundError);
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Resource not found');
        expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    it('should have a name property set to "Error"', () => {
        const error = new NotFoundError('Another not found error');
        expect(error.name).toBe('Error');
    });
});
