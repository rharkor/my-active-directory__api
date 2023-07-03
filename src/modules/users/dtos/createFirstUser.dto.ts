import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateFirstUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}
