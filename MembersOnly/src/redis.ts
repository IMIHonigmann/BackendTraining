import { createClient } from 'redis';

const redisClient = createClient({
    url: `redis://localhost:6379`,
    socket: {
        reconnectStrategy: retries => Math.min(retries * 100, 3000)
    }
});

redisClient.on('error', err => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

export const initRedis = async () => {
    await redisClient.connect();
    return redisClient;
};

export { redisClient };