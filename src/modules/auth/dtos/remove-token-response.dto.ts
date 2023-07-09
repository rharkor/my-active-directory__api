import { ApiProperty } from '@nestjs/swagger';

export class RemoveTokenResponseDto {
  @ApiProperty({
    description: 'Raw',
  })
  raw: unknown[];

  @ApiProperty({
    description: 'Affected',
  })
  affected?: number | null;
}
