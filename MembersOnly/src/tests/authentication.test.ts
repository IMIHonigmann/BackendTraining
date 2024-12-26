import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import express from "express";
import init from '../app';
import { redisClient } from '../redis';
import { resolve } from 'path';
const prisma = new PrismaClient();
const app = express();


describe('Authentication Tests', () => {
    let authToken: string;
    let app: any

    beforeAll(async () => {
        app = await init();
        const response = await request(app)
            .post('/users/login')
            .send({
                email: 'smegma@based.com',
                password: 'hashedPassword123'
            });
        authToken = response.body.token
        console.log('Auth Token:', response.body);
    })

    afterAll(async () => {
        await prisma.$disconnect();
        await redisClient.quit();
    });

    describe('Protected Routes can be accessed', () => {
        it('should reach the final middleware successfully', async () => {
            const response = await request(app)
                .get('/homeEndpoint')
                .set('Authorization', `Bearer ${authToken}`)

            expect(response.status).toEqual(200)

            expect(response.status).not.toEqual(401)
            expect(response.body.message).not.toEqual('Unauthorized')

            console.log('Response Body', response.body)
        })
    })

})