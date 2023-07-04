import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name',
    example: 'service-account',
    required: true,
  })
  name: string;
}
