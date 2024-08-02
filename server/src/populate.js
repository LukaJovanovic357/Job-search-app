import 'dotenv/config';
import mockData from './mock_data.json' assert { type: 'json' };
import Job from './models/Job.js';
import connectDB from './db/connect.js';

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Job.create(mockData);
        console.log('Mock data added');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

start();
