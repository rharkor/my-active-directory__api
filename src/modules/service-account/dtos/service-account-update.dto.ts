import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateServiceAccountDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Name',
    example: 'service-account',
    required: false,
  })
  name?: string;
}
