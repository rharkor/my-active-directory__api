import { ApiProperty } from '@nestjs/swagger';

export class RemoveResponseDto {
  @ApiProperty({
    description: 'Raw',
  })
  raw: unknown[];

  @ApiProperty({
    description: 'Affected',
  })
  affected?: number | null;
}
