import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/bad-request';
import { NotFoundError } from '../errors/not-found';
import Job from '../models/Job';
import moment from 'moment';
import mongoose from 'mongoose';

interface Stats {
    pending: number;
    interview: number;
    declined: number;
    [key: string]: number; // Allow other properties as well
}

const getAllJobs = async (req: Request, res: Response) => {
    const { search, status, jobType, sort } = req.query;

    const userId = req.user!.userId;

    const queryObject: any = {
        createdBy: userId
    };

    if (search) {
        queryObject.position = { $regex: search, $options: 'i' };
    }

    if (status && status !== 'all') {
        queryObject.status = status;
    }

    if (jobType && jobType !== 'all') {
        queryObject.jobType = jobType;
    }

    let result = Job.find(queryObject);

    if (sort) {
        switch (sort) {
            case 'latest':
                result = result.sort('-createdAt');
                break;
            case 'oldest':
                result = result.sort('createdAt');
                break;
            case 'a-z':
                result = result.sort('position');
                break;
            case 'z-a':
                result = result.sort('-position');
                break;
        }
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const jobs = await result;
    const totalJobs = await Job.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limit);

    res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

const getJob = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id: jobId } = req.params;

    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId
    });

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req: Request, res: Response) => {
    req.body.createdBy = req.user!.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { company, position } = req.body;
    const { id: jobId } = req.params;

    if (!company || !position) {
        throw new BadRequestError('Company or Position fields cannot be empty');
    }

    const job = await Job.findByIdAndUpdate(
        { _id: jobId, createdBy: userId },
        req.body,
        { new: true }
    );

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id: jobId } = req.params;

    const job = await Job.findByIdAndDelete({
        _id: jobId,
        createdBy: userId
    });

    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`);
    }

    res.status(StatusCodes.OK).send();
};

const showStats = async (req: Request, res: Response) => {
    let stats = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user!.userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statsObject = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr;
        acc[title] = count;
        return acc;
    }, {} as Stats);

    const defaultStats: Stats = {
        pending: statsObject.pending || 0,
        interview: statsObject.interview || 0,
        declined: statsObject.declined || 0
    };

    let monthlyApplications = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user!.userId) } },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
    ]);

    monthlyApplications = monthlyApplications
        .map(item => {
            const {
                _id: { year, month },
                count
            } = item;
            const date = moment()
                .month(month - 1)
                .year(year)
                .format('MMM Y');
            return { date, count };
        })
        .reverse();

    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { getAllJobs, getJob, createJob, updateJob, deleteJob, showStats };
