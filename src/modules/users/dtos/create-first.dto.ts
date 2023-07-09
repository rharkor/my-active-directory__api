import { passwordRegex } from '@/utils/auth';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateFirstDto {
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'Email',
    example: 'admin@admin.com',
    required: true,
    type: String,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  @ApiProperty({
    description: 'Username',
    example: 'admin',
    required: true,
    type: String,
    minLength: 5,
    maxLength: 50,
  })
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @ApiProperty({
    description: `Password (regex: ${passwordRegex})`,
    example: 'admin123',
    required: true,
    type: String,
    minLength: 8,
    maxLength: 50,
  })
  password: string;
}
