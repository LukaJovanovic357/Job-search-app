import request from 'supertest';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import app from '../../app';
import User from '../../models/User';
import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import { updateUser } from '../auth';
import { BadRequestError, UnauthenticatedError } from '../../errors';

vi.mock('../../models/User');
vi.mock('../../middleware/authentication', () => ({
    authentication: (req: Request, res: Response, next: NextFunction) => next()
}));

describe('Auth Endpoints', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user', async () => {
            const mockUser = {
                email: 'test@example.com',
                lastName: 'Doe',
                location: 'Test City',
                name: 'John',
                password: 'hashedpassword',
                createJWT: vi.fn().mockReturnValue('testtoken')
            };

            (User.create as unknown as vi.Mock).mockResolvedValue(mockUser);

            const res = await request(app).post('/api/v1/auth/register').send({
                email: 'test@example.com',
                password: 'password',
                name: 'John',
                lastName: 'Doe',
                location: 'Test City'
            });

            expect(res.status).toBe(201);
            expect(res.body.user).toHaveProperty('token', 'testtoken');
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login a user', async () => {
            const mockUser = {
                email: 'test@example.com',
                lastName: 'Doe',
                location: 'Test City',
                name: 'John',
                password: 'hashedpassword',
                comparePassword: vi.fn().mockResolvedValue(true),
                createJWT: vi.fn().mockReturnValue('testtoken')
            };

            (User.findOne as unknown as vi.Mock).mockResolvedValue(mockUser);

            const res = await request(app).post('/api/v1/auth/login').send({
                email: 'test@example.com',
                password: 'password'
            });

            expect(res.status).toBe(200);
            expect(res.body.user).toHaveProperty('token', 'testtoken');
        });

        it('should return error if credentials are invalid', async () => {
            (User.findOne as unknown as vi.Mock).mockResolvedValue(null);

            const res = await request(app).post('/api/v1/auth/login').send({
                email: 'invalid@example.com',
                password: 'password'
            });

            expect(res.status).toBe(401);
            expect(res.body.msg).toBe('Invalid Credentials');
        });
    });

    describe('Update User Controller', () => {
        let req: Partial<Request>;
        let res: Partial<Response>;

        beforeEach(() => {
            req = {
                body: {
                    name: 'John',
                    email: 'updated@example.com',
                    location: 'Updated City',
                    lastName: 'Doe'
                },
                user: { userId: 'userId' }
            };
            res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn()
            };
        });

        it('should update user details', async () => {
            const mockUser = {
                email: 'updated@example.com',
                lastName: 'Doe',
                location: 'Updated City',
                name: 'John',
                password: 'hashedpassword',
                createJWT: vi.fn().mockReturnValue('newtoken'),
                save: vi.fn().mockResolvedValue(true)
            };

            (User.findOne as unknown as vi.Mock).mockResolvedValue(mockUser);

            await updateUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                user: {
                    email: 'updated@example.com',
                    lastName: 'Doe',
                    location: 'Updated City',
                    name: 'John',
                    token: 'newtoken'
                }
            });
        });

        it('should return error if required fields are missing', async () => {
            req.body = {
                email: '',
                lastName: 'Doe',
                location: 'Updated City',
                name: 'John'
            };

            await expect(
                updateUser(req as Request, res as Response)
            ).rejects.toThrow(BadRequestError);
        });
    });
});
