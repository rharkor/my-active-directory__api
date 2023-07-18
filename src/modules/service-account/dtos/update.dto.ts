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

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description',
    example: 'Service account for my app',
    required: false,
  })
  description?: string;
}
