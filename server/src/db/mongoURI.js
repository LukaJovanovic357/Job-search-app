import dotenv, { config } from 'dotenv';

config({
    path: '../../../server/.env'
});

const MONGO_URI = process.env.MONGO_URI;

export default MONGO_URI;
