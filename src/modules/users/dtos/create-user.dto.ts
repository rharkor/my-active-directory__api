import {
  IsString,
  IsOptional,
  IsObject,
  IsEmail,
  MinLength,
  IsArray,
} from 'class-validator';
import Role from '../../roles/entities/role.entity';
import { DeepPartial } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'Email',
    example: 'admin@admin.com',
    required: false,
    type: String,
  })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @ApiProperty({
    description: 'Username',
    example: 'admin',
    required: false,
    type: String,
    minLength: 5,
  })
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @ApiProperty({
    description: 'Password',
    example: 'admin123',
    required: false,
    type: String,
    minLength: 8,
  })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'First name',
    example: 'John',
    required: false,
    type: String,
  })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    required: false,
    type: String,
  })
  lastName?: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    description: 'Metadata',
    example: { foo: 'bar' },
    required: false,
    type: Object,
  })
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Roles',
    example: [{ id: 1, name: 'admin' }],
    required: false,
    type: [Role],
  })
  roles?: DeepPartial<Role[]>;
}