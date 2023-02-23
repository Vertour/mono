import { Injectable } from '@nestjs/common';
import { InjectRedis, Redis } from 'ioredis-9.0';

@Injectable()
export class RedisWrapperService {
  constructor(@InjectRedis() private readonly cache: Redis) {}

  async get(key: string): Promise<string | null> {
    try {
      return await this.cache.get(key);
    } catch {
      return null;
    }
  }

  async keys(pattern?: string): Promise<string[]> {
    try {
      if (pattern) {
        return this.cache.keys(pattern);
      }
      return this.cache.keys('*');
    } catch {
      return [] as string[];
    }
  }

  async set(key: string, value: string): Promise<'OK' | null> {
    try {
      return await this.cache.set(key, value);
    } catch {
      return null;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.cache.del(key);
    } catch {
      return 0;
    }
  }

  async delJSON({ key, path }: { key: string; path?: string }): Promise<boolean> {
    try {
      path ? await this.cache.call('json.del', key, path) : await this.cache.call('json.del', key);
      return true;
    } catch {
      return false;
    }
  }

  async setJSON<D>({
    key,
    params,
    data,
    time
  }: {
    key: string;
    params?: string;
    data: D;
    time?: number;
  }): Promise<'OK' | null> {
    try {
      const response = await this.cache.call(
        'json.set',
        key,
        params ? '$.object.' + params : '$',
        params ? JSON.stringify(data) : JSON.stringify({ object: data })
      );

      time ? this.expire(key, time) : null;

      return response;
    } catch {
      return null;
    }
  }

  async setJSONParam<D>({ key, param, data }: { key: string; param: string; data: D }): Promise<'OK' | null> {
    try {
      return await this.cache.call('JSON.SET', key, `$.object.${param}`, `${JSON.stringify(data)}`);
    } catch {
      return null;
    }
  }

  async getJSON<T>(...keys: string[]): Promise<T> {
    try {
      return JSON.parse((await this.cache.call('json.get', ...keys)) as string).object as T;
    } catch {
      return null;
    }
  }

  async mgetJSON<T>(keys: string[]): Promise<T[]> {
    try {
      return ((await this.cache.call('json.mget', ...keys)) as Array<string>).map(
        (element: string) => (JSON.parse(element).object) as T
      );
    } catch {
      return null;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return (await this.cache.exists(key)) ? true : false;
    } catch {
      return false;
    }
  }

  async expire(key: string, seconds: number): Promise<number> {
    try {
      return await this.cache.expire(key, seconds);
    } catch {
      return 0;
    }
  }

  async searchByParams<T>(idx: string, params: string): Promise<T[]> {
    try {
      return (await this.cache.call('FT.SEARCH', `${idx}`, `'${params}'`)) as T[];
    } catch {
      return [];
    }
  }

  async arrAppendJSON({
    key,
    path,
    values
  }: {
    key: string;
    path: string;
    values: string[];
  }): Promise<number> {
    console.log('JSON.ARRAPPEND', key, '$.object.' + path, ...values);
    return (await this.cache.call('JSON.ARRAPPEND', key, '$.object.' + path, ...values)) as number;
  }
}
