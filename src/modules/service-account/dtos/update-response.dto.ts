import { ApiProperty } from '@nestjs/swagger';

export class UpdateResponseDto {
  @ApiProperty({
    description: 'Generated maps',
  })
  generatedMaps: unknown[];

  @ApiProperty({
    description: 'Raw',
  })
  raw: unknown[];

  @ApiProperty({
    description: 'Affected',
  })
  affected?: number;
}
