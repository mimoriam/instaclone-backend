import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { genSalt } from 'bcrypt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string | Buffer): Promise<string> {
    const salt = await genSalt(12);

    return bcrypt.hash(data, salt);
  }
  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
