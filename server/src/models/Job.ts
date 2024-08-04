import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IJob extends Document {
    company: string;
    position: string;
    status: 'interview' | 'declined' | 'pending';
    createdBy: mongoose.Types.ObjectId;
    jobType: 'full-time' | 'part-time' | 'remote' | 'internship';
    jobLocation: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const JobSchema: Schema<IJob> = new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, 'Please provide company name'],
            maxlength: 50
        },
        position: {
            type: String,
            required: [true, 'Plaese provide position name'],
            maxlength: 100
        },
        status: {
            type: String,
            enum: ['interview', 'declined', 'pending'],
            default: 'pending'
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user']
        },
        jobType: {
            type: String,
            enum: ['full-time', 'part-time', 'remote', 'internship'],
            default: 'full-time'
        },
        jobLocation: {
            type: String,
            default: 'my city',
            required: true
        }
    },
    { timestamps: true }
);

const Job: Model<IJob> = mongoose.model('Job', JobSchema);
export default Job;
