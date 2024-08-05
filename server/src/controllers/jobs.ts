import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/bad-request';
import { NotFoundError } from '../errors/not-found';
import Job from '../models/Job';

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

export { getAllJobs, getJob, createJob, updateJob, deleteJob };
