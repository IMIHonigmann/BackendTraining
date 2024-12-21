import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class User {
    public id: number;
    public email: string;
    public password: string;

    constructor(id: number, email: string, password: string) {
        this.id = id;
        this.email = email;
        this.password = password;
    }

    static async createUser(email: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await prisma.user.create({
            data: {
                name: 'placeholder',
                email: email,
                password: hashedPassword
            }
        })
        return new User(result.id, result.email, result.password);
    }

    static async findByEmail(email: string): Promise<User | null> {
        const result = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!result) return null;
        return new User(result.id, result.email, result.password);
    }

    static async findById(id: number): Promise<User | null> {
        const result = await prisma.user.findUnique({
            where: {
                id: id
            }
        })
        if (!result) return null;
        return new User(result.id, result.email, result.password);
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

export default User;