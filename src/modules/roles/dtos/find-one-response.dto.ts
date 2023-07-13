import { ApiProperty } from '@nestjs/swagger';

export class FindOneResponseDto {
  @ApiProperty({
    description: 'Id',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name',
    example: 'super-admin',
  })
  name: string;

  @ApiProperty({
    description: 'Display name',
    example: 'Super admin',
  })
  displayName: string;

  @ApiProperty({
    description: 'Description',
    example: 'Super admin',
  })
  description?: string;

  @ApiProperty({
    description: 'Color',
    example: '#000000',
  })
  color?: string;
}
