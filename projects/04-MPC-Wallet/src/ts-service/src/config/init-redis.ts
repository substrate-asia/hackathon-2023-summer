import {config} from "./config";
import {createClient} from 'redis';

const url = "redis://" + config.redis.host + ":"+config.redis.port + "/"+config.redis.db_number
export const RedisClient =  createClient({
    url: url
});
export const initRedis = async () =>{

    RedisClient.on('ready', () => {
        console.info(`redisReady${new Date().toDateString()}`);
    });

    RedisClient.on('end', (err: Error) => {
        console.error('Redis end', err);
        process.exit(1);
    });

    RedisClient.on('error', (err: Error) => {
        console.error('Redis error', err);
        console.error('redis 连接失败，程序退出，请检查.env中redis配置');
        process.exit(1);
    });

    RedisClient.on('connect', () => {
        console.info('Redis connect success!');
    });

    await RedisClient.connect()
}