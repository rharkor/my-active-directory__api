import { ApiProperty } from '@nestjs/swagger';

export class RemoveResponseDto {
  @ApiProperty({
    name: 'Raw',
    example: [],
  })
  raw: unknown[];

  @ApiProperty({
    name: 'Affected',
    example: 1,
  })
  affected?: number | null;
}
