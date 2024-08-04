import 'express-async-errors';
import express, { Response } from 'express';
import { notFound as notFoundMiddleware } from './middleware/index';
import { errorHandlerMiddleware } from './middleware/index';
import jobsRouter from './routes/jobs';
import authRouter from './routes/auth';
import connectDB from './db/connect';
import { authentication as authenticateUser } from './middleware/index';
import MONGO_URI from './db/mongoURI';

const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.get('/', (_, res: Response) => {
    res.send('jobs api');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port http://localhost:${port}`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
