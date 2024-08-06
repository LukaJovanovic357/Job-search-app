import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import { notFound } from '../not-found';

const mockRequest = () => ({} as Request);

const mockResponse = () => {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.send = vi.fn().mockReturnValue(res);
    return res;
};

describe('notFound Middleware', () => {
    it('should return 404 and message for non-existent routes', () => {
        const req = mockRequest();
        const res = mockResponse();

        notFound(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Route does not exist');
    });
});
