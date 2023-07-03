import {
  IsString,
  IsOptional,
  IsObject,
  IsEmail,
  MinLength,
  IsNumber,
} from 'class-validator';
import Role from '../entities/role.entity';
import { DeepPartial } from 'typeorm';

export class UpdateUserDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  roles?: DeepPartial<Role[]>;
}
