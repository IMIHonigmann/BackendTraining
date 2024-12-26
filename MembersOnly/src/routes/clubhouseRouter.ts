import express from 'express';
import { PrismaClient } from '@prisma/client';
import { checkAuthorization, showClubhouseContents } from '../controllers/checkUserClubhouseAuthController';
import argon2 from 'argon2';
import { authenticateJWT } from '../middlewares/auth.middleware';
const prisma = new PrismaClient();
const clubHouseRouter = express.Router();

clubHouseRouter.get('/:clubhouseId', authenticateJWT,
    checkAuthorization,
    showClubhouseContents
)

clubHouseRouter.post('/createClubHouse', authenticateJWT,
    async (req, res) => {
        const { title, passcode } = req.body
        const hashedPassword = await argon2.hash(passcode)
        await prisma.clubhouse.create({
            data: {
                title: title,
                passcode: hashedPassword
            }
        })

        res.status(200).send('Clubhouse successfully created')
        console.log('Clubhouse successfully created')
    })

clubHouseRouter.post('/createClubHouse', authenticateJWT,
    async (req, res) => {
        const { title, passcode } = req.body
        const hashedPassword = await argon2.hash(passcode)
        await prisma.clubhouse.create({
            data: {
                title: title,
                passcode: hashedPassword
            }
        })

        res.status(200).send('Clubhouse successfully created')
        console.log('Clubhouse successfully created')
    })

export default clubHouseRouter