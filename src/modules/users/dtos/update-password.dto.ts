import { passwordRegex } from '@/utils/auth';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @ApiProperty({
    description: `Password (regex: ${passwordRegex})`,
    example: 'admin123',
    required: true,
    type: String,
    minLength: 8,
    maxLength: 50,
  })
  password: string;
}
