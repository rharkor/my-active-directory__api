import {
  IsString,
  IsOptional,
  IsObject,
  IsEmail,
  MinLength,
  IsArray,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { passwordRegex } from '@/utils/auth';
import { DeepPartial } from 'typeorm';
import Role from '@/modules/roles/entities/role.entity';
import SysRole from '@/modules/roles/entities/sys-role.entity';
import Project from '@/modules/projects/entities/project.entity';

export class CreateFilledDto {
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
  @MaxLength(50)
  @ApiProperty({
    description: 'Username',
    example: 'admin',
    required: false,
    type: String,
    minLength: 5,
    maxLength: 50,
  })
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @ApiProperty({
    description: `Password (regex: ${passwordRegex})`,
    example: 'admin123',
    required: false,
    type: String,
    minLength: 8,
    maxLength: 50,
  })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'First name',
    example: 'John',
    required: false,
    type: String,
    minLength: 2,
    maxLength: 50,
  })
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    required: false,
    type: String,
    minLength: 2,
    maxLength: 50,
  })
  @MinLength(2)
  @MaxLength(50)
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
    example: [{ id: 1, name: 'example' }],
    required: false,
  })
  roles?: DeepPartial<Role[]>;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'SysRoles',
    example: [{ id: 1, name: 'super-admin' }],
    required: false,
  })
  sysroles?: DeepPartial<SysRole[]>;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Projects',
    example: [{ id: 1, name: 'my-app' }],
    required: false,
  })
  projects?: DeepPartial<Pick<Project, 'id'>[]>;
}
