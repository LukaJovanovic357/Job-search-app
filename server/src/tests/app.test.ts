import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../app';

describe('GET /', () => {
    it.skip('should return 200 OK', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
    });
});
