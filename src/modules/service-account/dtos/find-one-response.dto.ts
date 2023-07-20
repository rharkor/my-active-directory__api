import { ApiProperty } from '@nestjs/swagger';

export class FindOneResponseDto {
  @ApiProperty({
    description: 'Id',
  })
  id: number;

  @ApiProperty({
    description: 'Name',
  })
  name: string;

  @ApiProperty({
    description: 'Description',
  })
  description?: string;

  @ApiProperty({
    description: 'Projects',
  })
  projects?: {
    id: number;
    name: string;
  }[];
}
