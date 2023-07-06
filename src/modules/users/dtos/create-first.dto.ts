import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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
  @ApiProperty({
    description: 'Username',
    example: 'admin',
    required: true,
    type: String,
    minLength: 5,
  })
  username: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    description: 'Password',
    example: 'admin123',
    required: true,
    type: String,
    minLength: 8,
  })
  password: string;
}
