import { ApiProperty } from '@nestjs/swagger';
import { Matches, IsString, IsOptional } from 'class-validator';

export class UpdateDto {
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
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
}
