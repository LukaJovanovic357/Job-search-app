import request from 'supertest';
import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import app from '../../app';
import 'dotenv/config';

const generateToken = (payload: object) => {
    return jwt.sign(payload, process.env.SECRET_KEY!);
};

describe('Authentication Middleware', () => {
    it('should return 401 if no token is provided', async () => {
        const res = await request(app)
            .get('/api/v1/jobs')
            .set('Authorization', '');
        expect(res.statusCode).toEqual(401);
        expect(res.body.msg).toBe('Authentication invalid');
    });

    it('should return 401 if token is invalid', async () => {
        const res = await request(app)
            .get('/api/v1/jobs')
            .set('Authorization', 'Bearer invalidtoken');
        expect(res.statusCode).toEqual(401);
        expect(res.body.msg).toBe('Authentication invalid');
    });

    it('should pass if token is valid', async () => {
        const token = generateToken({ userId: 'validUserId' });
        const res = await request(app)
            .get('/api/v1/jobs')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).not.toEqual(401);
        expect(res.body).not.toHaveProperty('msg', 'Authentication invalid');
    });
});
