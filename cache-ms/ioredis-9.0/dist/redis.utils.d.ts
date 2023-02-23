import { RedisModuleOptions } from './redis.interfaces';
import * as Redis from 'ioredis-9.0';
export declare function getRedisOptionsToken(connection?: string): string;
export declare function getRedisConnectionToken(connection?: string): string;
export declare function createRedisConnection(options: RedisModuleOptions): Redis.Redis;
