import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RemoveDto {
  @ApiProperty({
    description: 'Force remove the user',
    example: true,
    nullable: true,
  })
  force?: boolean;

  @ApiProperty({
    description: 'Username of the user to remove',
    example: 'johndoe',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'Email of the user to remove',
    example: 'test@test.com',
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'password of the user to remove',
    example: 'test1234',
  })
  @IsString()
  @IsOptional()
  password?: string;
}
