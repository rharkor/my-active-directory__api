import { ApiProperty } from '@nestjs/swagger';

export class FindAllNoPaginationResponseDto {
  @ApiProperty({
    description: 'Roles',
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
