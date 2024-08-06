import { describe, it, expect } from 'vitest';
import { CustomAPIError } from '../custom-api';

describe('CustomAPIError', () => {
    it('should create an error with a message', () => {
        const errorMessage = 'This is a custom API error';
        const error = new CustomAPIError(errorMessage);

        expect(error).toBeInstanceOf(CustomAPIError);
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(errorMessage);
    });

    it('should have a name property set to "Error"', () => {
        const error = new CustomAPIError('Another custom API error');
        expect(error.name).toBe('Error');
    });
});
