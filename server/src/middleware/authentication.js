import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors/index.js';
import 'dotenv/config';

const authentication = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        // attach the user to the job routes
        req.user = { userId: payload.userId, name: payload.name };
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
};

export { authentication };
