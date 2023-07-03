import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  @ApiProperty({
    required: false,
    type: String,
    description: 'User email',
    example: 'admin@admin.com',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'User username',
    example: 'admin',
  })
  username?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'User password',
    example: 'Azerty1234!',
  })
  password: string;
}
