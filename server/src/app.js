import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import { notFound as notFoundMiddleware } from './middleware/index.js';
import { errorHandlerMiddleware } from './middleware/index.js';
import jobsRouter from './routes/jobs.js';
import authRouter from './routes/auth.js';
import connectDB from './db/connect.js';
import { authentication as authenticateUser } from './middleware/index.js';

const app = express();

app.use(express.json());
// extra packages

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.get('/', (_, res) => {
    res.send('jobs api');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port http://localhost:${port}`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
