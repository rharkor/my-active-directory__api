import Project from '@/modules/projects/entities/project.entity';
import { slugRegex } from '@/utils/auth';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DeepPartial } from 'typeorm';

export class CreateServiceAccountDtoFilled {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  @Matches(slugRegex, {
    message: 'name must be kebab-case',
  })
  @ApiProperty({
    description: 'Name (kebab-case)',
    example: 'service-account',
    required: true,
    minLength: 5,
    maxLength: 50,
  })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  @ApiProperty({
    description: 'Description',
    example: 'Service account for my app',
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Projects',
    example: [
      {
        id: '1',
        name: 'my-app',
      },
    ],
    required: false,
  })
  projects?: DeepPartial<Pick<Project, 'id'>[]>;
}
