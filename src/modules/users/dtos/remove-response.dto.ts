import { ApiProperty } from '@nestjs/swagger';

export class RemoveResponseDto {
  @ApiProperty({
    example: [],
  })
  raw: unknown[];

  @ApiProperty({
    example: 1,
  })
  affected?: number | null;
}
