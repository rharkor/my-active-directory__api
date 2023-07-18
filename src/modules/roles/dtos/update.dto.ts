import { slugRegex } from '@/utils/auth';
import { ApiProperty } from '@nestjs/swagger';
import { Matches, IsString, IsOptional, IsHexColor } from 'class-validator';

export class UpdateDto {
  @Matches(slugRegex, {
    message: 'name must be kebab-case',
  })
  @IsOptional()
  @ApiProperty({
    description: 'Name',
    example: 'super-admin',
    nullable: true,
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Display name',
    example: 'Super admin',
    nullable: true,
  })
  displayName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description',
    example: 'Super admin',
    nullable: true,
  })
  description?: string;

  @IsString()
  @IsHexColor()
  @IsOptional()
  @ApiProperty({
    description: 'Color',
    example: '#000000',
  })
  color?: string;
}
