import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import init from '../app';
import { redisClient } from '../redis';
const prisma = new PrismaClient();

describe('Validation and Sanitization Tests', () => {
    let app: any

    beforeAll(async () => {
        app = await init();

    })

    afterAll(async () => {
        await prisma.user.deleteMany({
            where: {
                email: {
                    contains: 'test@password.'
                }
            }
        });
        await prisma.$disconnect();
        await redisClient.quit();
    });

    describe('Password Validation', () => {
        const testCases = [
            {
                scenario: 'too short password',
                email: 'test@password.tooshort',
                password: 'short1!',
            },
            {
                scenario: 'missing number and special char',
                email: 'test@password.nonumspecial',
                password: 'abcdefghijk',
            },
            {
                scenario: 'missing letters',
                email: 'test@password.nochar',
                password: '12345678!',
            }
        ];

        test.each(testCases)('should reject $scenario',
            async ({ email, password }) => {
                const response = await request(app)
                    .post('/users/register')
                    .send({ email, password })

                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('errors')
            })

        it('Password should not be stored as is', async () => {
            await request(app).post('/users/register').send({
                email: 'test@password.storage.com',
                password: 'hashedPassword123!'
            })
            const user = await prisma.user.findUnique({
                where: {
                    email: 'test@password.storage.com'
                },
                select: {
                    password: true
                }
            })
            expect(user!.password).not.toEqual('hashedPassword123!')
        })
    })
})