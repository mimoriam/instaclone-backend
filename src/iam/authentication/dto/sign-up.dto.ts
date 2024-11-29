import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class SignUpDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly fullName: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly role: Role;

  @MinLength(5)
  readonly password: string;
}
