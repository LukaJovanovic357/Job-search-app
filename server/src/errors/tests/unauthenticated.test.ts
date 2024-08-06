import { describe, it, expect } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import { UnauthenticatedError } from '../unauthenticated';

describe('UnauthenticatedError', () => {
    it('should create an error with a message and status code', () => {
        const errorMessage = 'Authentication required';
        const error = new UnauthenticatedError(errorMessage);

        expect(error).toBeInstanceOf(UnauthenticatedError);
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(errorMessage);
        expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should have a name property set to "Error"', () => {
        const error = new UnauthenticatedError('Another authentication error');
        expect(error.name).toBe('Error');
    });
});
