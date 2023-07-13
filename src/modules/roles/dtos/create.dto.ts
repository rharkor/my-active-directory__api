import { ApiProperty } from '@nestjs/swagger';
import {
  Matches,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsHexColor,
} from 'class-validator';

export class CreateDto {
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'name must be kebab-case',
  })
  @ApiProperty({
    description: 'Name',
    example: 'super-admin',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Display name',
    example: 'Super admin',
  })
  displayName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description',
    example: 'Super admin',
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

  @IsOptional()
  @IsBoolean()
  deletable?: boolean;
}
