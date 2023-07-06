import { ApiProperty } from '@nestjs/swagger';

export class CreateResponseDto {
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
    description: 'Deletable',
    example: true,
  })
  deletable: boolean;
}
