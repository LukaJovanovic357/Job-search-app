import express from 'express';
import { testUser } from '../middleware/testUser';

import {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
} from '../controllers/jobs';

const router = express.Router();

router.route('/').post(testUser, createJob).get(getAllJobs);
router
    .route('/:id')
    .get(getJob)
    .delete(testUser, deleteJob)
    .patch(testUser, updateJob);

export default router;
