import express from 'express';
import { login, register, updateUser } from '../controllers/auth.js';
import { authentication as authenticateUser } from '../middleware/authentication.js';
import { testUser } from '../middleware/index.js';

const router = express.Router();

// Optional api rate limiter
// const apiLimiter = rateLimiter({
//     windowsMs: 15 * 60 * 1000,
//     max: 10,
//     message: {
//         msg: 'Too many requests from this IP, please try again after 15 minutes.'
//     }
// });

router.post('/register', register);
router.post('/login', login);
router.patch('/updateUser', authenticateUser, testUser, updateUser);

export default router;
