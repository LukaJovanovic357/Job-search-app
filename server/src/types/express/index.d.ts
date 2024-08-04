import { IUser } from '../../models/User';

declare global {
    namespace Express {
        interface User {
            userId: string;
            testUser?: boolean;
        }

        interface Request {
            user?: {
                userId: string;
                testUser?: boolean;
            };
        }
    }
}
