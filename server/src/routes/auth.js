import express from 'express';
import { login, register, updateUser } from '../controllers/auth.js';
import { authentication as authenticateUser } from '../middleware/authentication.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/updateUser', authenticateUser, updateUser);

export default router;
