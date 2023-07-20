import { slugRegex } from '@/utils/auth';
import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsOptional, IsString, Matches } from 'class-validator';

export class CreateDto {
  @Matches(slugRegex, {
    message: 'name must be kebab-case',
  })
  @ApiProperty({
    description: 'Name',
    example: 'super-admin',
  })
  name: string;

  @IsString()
  @IsHexColor()
  @IsOptional()
  @ApiProperty({
    description: 'Color',
    example: '#000000',
  })
  color: string;
}
