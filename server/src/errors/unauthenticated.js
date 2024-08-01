import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from './index.js';

class UnauthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

export { UnauthenticatedError };
