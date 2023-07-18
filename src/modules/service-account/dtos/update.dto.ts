import { slugRegex } from '@/utils/auth';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateServiceAccountDto {
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(50)
  @Matches(slugRegex, {
    message: 'name must be kebab-case',
  })
  @ApiProperty({
    description: 'Name (kebab-case)',
    example: 'service-account',
    required: false,
    minLength: 5,
    maxLength: 50,
  })
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(150)
  @ApiProperty({
    description: 'Description',
    example: 'Service account for my app',
    required: false,
  })
  description?: string;
}
