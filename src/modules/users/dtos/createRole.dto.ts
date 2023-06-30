import {
  Matches,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateRoleDto {
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'name must be kebab-case',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsBoolean()
  deletable?: boolean;
}
