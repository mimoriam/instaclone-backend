import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export class InvalidateRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(private configService: ConfigService) {}

  private redisClient: Redis;

  onApplicationBootstrap(): any {
    this.redisClient = new Redis(`${process.env.REDIS_URL}`, {
      maxRetriesPerRequest: 20,
    });

    this.redisClient.on('connect', () => {
      console.log('Success! Redis connection established.');
    });
  }

  onApplicationShutdown(signal?: string): any {
    console.log('Ready to exit Redis: ', signal);
    return this.redisClient.quit();
  }

  async insert(userId: number | string, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number | string, tokenId: string): Promise<boolean> {
    const storedId = await this.redisClient.get(this.getKey(userId));

    if (storedId !== tokenId) {
      throw new InvalidateRefreshTokenError();
    }
    return storedId === tokenId;
  }

  async invalidate(userId: number | string): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: number | string): string {
    return `user-${userId}`;
  }
}
