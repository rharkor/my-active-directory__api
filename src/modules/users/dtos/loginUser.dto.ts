import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
