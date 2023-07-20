import { ApiProperty } from '@nestjs/swagger';

export class FindAllNoPaginationResponseDto {
  @ApiProperty({
    description: 'Projects',
    example: [
      {
        name: 'super-admin',
        color: '#ff0000',
      },
    ],
  })
  data: {
    name: string;
    color?: string;
  }[];
}
