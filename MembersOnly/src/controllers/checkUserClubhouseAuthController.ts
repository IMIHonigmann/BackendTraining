import jwt from 'jsonwebtoken'
import { redisClient } from '../redis';
import { PrismaClient, Clubhouse } from '@prisma/client';
import argon2 from 'argon2'
import { binarySearch } from '../utils/binarySearch';
const prisma = new PrismaClient();


export async function checkAuthorization(req, res, next) {
    const { clubhouseId } = req.params;

    const isMember = await redisClient.sIsMember(`clubhouse:${clubhouseId}`, req.user!.id.toString())
    if (isMember) {
        console.log('Check 1/3 successful', 'Cache Hit: redirecting...')
        return next();
    }
    console.log('Check 1/3 failed', 'Cache Miss: Redis does not contain the user in the clubhouse, checking JWT...')

    const token = req.headers.authorization!.split(' ')[1]; // Remove 'Bearer '
    const decoded = jwt.decode(token) as JWTPL;
    const isClubhouseSignedInJWT = binarySearch(decoded!.accessibleClubhouses, parseInt(clubhouseId)) > -1

    if (isClubhouseSignedInJWT) {
        console.log('Check 2/3 successful', 'JWT successfully authenticated, redirecting...')
        await redisClient.sAdd(`clubhouse:${clubhouseId}`, req.user!.id.toString())
        return next();
    }

    console.log('Check 2/3 failed', 'JWT does not contain the clubhouse, checking DB...')
    const existingAccess = await prisma.clubhouseUser.findUnique({
        where: {
            userId_clubhouseId: {
                userId: req.user!.id,
                clubhouseId: parseInt(clubhouseId)
            }
        }
    })
    if (existingAccess) {
        console.log('Check 3/3 successful', 'DB lookup done, redirecting...');
        try {
            const isMember = await redisClient.sIsMember(`clubhouse:${clubhouseId}`, req.user!.id.toString())
            if (!isMember) {
                await redisClient.sAdd(`clubhouse:${clubhouseId}`, req.user!.id.toString())
            }
        } catch (error) {
            console.error('Error processing users:', error)
        }

        return next();
    }

    console.log(`All checks failed! User is not authorized to view this clubhouse, password will be checked...`)
    const { pagePW, rememberMe } = req.body;
    const clubHouse = await prisma.clubhouse.findUnique({
        where: { id: parseInt(clubhouseId) }
    })

    if (!clubHouse) {
        res.status(404).send('Clubhouse does not exist')
        return
    }
    res.locals.clubHouse = clubHouse;
    let requestedPassword = clubHouse.passcode;
    if (!requestedPassword) {
        requestedPassword = ""
    }
    if (await argon2.verify(requestedPassword, pagePW)) {
        console.log('User entered the right password');
        if (rememberMe) {
            console.log('User will be cached and remembered on next visit')
            await redisClient.sAdd(`clubhouse:${clubhouseId}`, req.user!.id.toString())
            await prisma.clubhouseUser.create({
                data: {
                    userId: req.user!.id,
                    clubhouseId: parseInt(clubhouseId)
                }
            })
        }
        return next();
    } else {
        res.status(409).send('Incorrect Password')
        return;
    }

}

export async function showClubhouseContents(req, res) {
    const { clubhouseId } = req.params;
    const posts = await prisma.post.findMany({
        where: { clubhouseId: parseInt(clubhouseId) }
    })

    // TODO: This seems stupid because it means that no matter what we do a database call is always required, which nullifies the speed advantage of the other authentication methods
    // At this point this means that the password check is the fastest because it only does the database call while the others do their operation + an additional database call
    // consider caching this query at least
    const clubHouse: Pick<Clubhouse, 'title'> | null = res.locals.clubHouse ?? await prisma.clubhouse.findUnique({
        where: { id: parseInt(clubhouseId) },
        select: { title: true }
    })

    if (!clubHouse) {
        res.status(404).send('Clubhouse does not exist')
        return
    }

    res.status(200).json({
        message: 'You made it cool guy',
        clubHouseName: clubHouse.title ?? "Nameless Clubhouse",
        posts
    })
}