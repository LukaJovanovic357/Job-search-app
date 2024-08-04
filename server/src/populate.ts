import mockData from './mock_data.json';
import Job from './models/Job';
import connectDB from './db/connect';
import MONGO_URI from './db/mongoURI';

const start = async () => {
    try {
        await connectDB(MONGO_URI);
        await Job.create(mockData);
        console.log('Mock data added');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

start();
