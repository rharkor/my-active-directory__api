import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
