import {
  IsString,
  IsOptional,
  IsObject,
  IsEmail,
  MinLength,
} from 'class-validator';
import Role from '../../roles/entities/role.entity';
import { DeepPartial } from 'typeorm';

export class UpdateUserDto {
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
