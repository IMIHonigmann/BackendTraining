import { Tier } from '@prisma/client';


declare global {
    namespace Express {
        export interface User {
            id: number;
            email: string;
            password: string;
        }
        export interface Request {
            user?: User | undefined;
        }
    }

    export interface JWTPL {
        id: number
        email: string
        accessibleClubhouses: number[];
    }
}