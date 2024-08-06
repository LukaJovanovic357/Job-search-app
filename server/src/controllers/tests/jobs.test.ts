import request from 'supertest';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import app from '../../app';
import jwt from 'jsonwebtoken';
import Job from '../../models/Job';
import 'dotenv/config';

vi.mock('../../models/Job');

describe('GET /api/v1/jobs', () => {
    let token: string;

    beforeEach(() => {
        token = jwt.sign({ userId: 'validUserId' }, process.env.SECRET_KEY!);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return all jobs for the authenticated user', async () => {
        const mockJobs = [
            { position: 'Developer', createdBy: 'validUserId' },
            { position: 'Designer', createdBy: 'validUserId' }
        ];

        (Job.find as unknown as vi.Mock).mockReturnValue({
            skip: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue(mockJobs)
        });

        (Job.countDocuments as unknown as vi.Mock).mockResolvedValue(
            mockJobs.length
        );

        const res = await request(app)
            .get('/api/v1/jobs')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.jobs).toHaveLength(mockJobs.length);
        expect(res.body.totalJobs).toEqual(mockJobs.length);
        expect(res.body.numOfPages).toEqual(1);
    });

    it('should return filtered jobs based on query parameters', async () => {
        const mockJobs = [{ position: 'Developer', createdBy: 'validUserId' }];

        (Job.find as unknown as vi.Mock).mockReturnValue({
            skip: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue(mockJobs)
        });

        (Job.countDocuments as unknown as vi.Mock).mockResolvedValue(
            mockJobs.length
        );

        const res = await request(app)
            .get('/api/v1/jobs?search=Developer')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.jobs).toHaveLength(mockJobs.length);
        expect(res.body.jobs[0].position).toEqual('Developer');
    });

    it('should return sorted jobs based on query parameters', async () => {
        const mockJobs = [
            { position: 'Designer', createdBy: 'validUserId' },
            { position: 'Developer', createdBy: 'validUserId' }
        ];

        (Job.find as unknown as vi.Mock).mockReturnValue({
            sort: vi.fn().mockReturnThis(),
            skip: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue(mockJobs)
        });

        (Job.countDocuments as unknown as vi.Mock).mockResolvedValue(
            mockJobs.length
        );

        const res = await request(app)
            .get('/api/v1/jobs?sort=a-z')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.jobs).toHaveLength(mockJobs.length);
        expect(res.body.jobs[0].position).toEqual('Designer');
        expect(res.body.jobs[1].position).toEqual('Developer');
    });

    it('should return paginated jobs based on query parameters', async () => {
        const mockJobs = Array.from({ length: 10 }, (_, i) => ({
            position: `Job${i + 1}`,
            createdBy: 'validUserId'
        }));

        (Job.find as unknown as vi.Mock).mockReturnValue({
            skip: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue(mockJobs)
        });

        (Job.countDocuments as unknown as vi.Mock).mockResolvedValue(20);

        const res = await request(app)
            .get('/api/v1/jobs?page=2&limit=10')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.jobs).toHaveLength(10);
        expect(res.body.totalJobs).toEqual(20);
        expect(res.body.numOfPages).toEqual(2);
    });

    it('should delete a job for the authenticated user', async () => {
        const mockJobId = 'validJobId';

        (Job.findByIdAndDelete as unknown as vi.Mock).mockResolvedValue({
            _id: mockJobId,
            createdBy: 'validUserId'
        });

        const res = await request(app)
            .delete(`/api/v1/jobs/${mockJobId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
    });

    it('should return 404 if the job does not exist', async () => {
        const mockJobId = 'nonExistentJobId';

        (Job.findByIdAndDelete as unknown as vi.Mock).mockResolvedValue(null);

        const res = await request(app)
            .delete(`/api/v1/jobs/${mockJobId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(404);
    });
});
