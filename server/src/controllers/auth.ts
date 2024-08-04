import { Request, Response } from 'express';
import User from '../models/User';
import StatusCodes from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';

const register = async (req: Request, res: Response) => {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token
        }
    });
};

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials');
    }
    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token
        }
    });
};

const updateUser = async (req: Request, res: Response) => {
    const { name, email, location, lastName } = req.body;

    if (!name || !email || !location || !lastName) {
        throw new BadRequestError('Please provide all required values');
    }

    const user = await User.findOne({ _id: req.user!.userId });

    user.name = name;
    user.email = email;
    user.location = location;
    user.lastName = lastName;

    await user.save();

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token
        }
    });
};

export { login, register, updateUser };
