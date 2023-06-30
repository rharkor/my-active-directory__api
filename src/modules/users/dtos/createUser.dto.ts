import { IsString, IsOptional, IsObject, IsEmail } from 'class-validator';
import Role from '../entities/role.entity';
import { DeepPartial } from 'typeorm';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsObject()
  roles?: DeepPartial<Role[]>;
}
