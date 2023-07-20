import { ApiProperty } from '@nestjs/swagger';

export class UpdateTokenResponseDto {
  @ApiProperty({
    description: 'Generated maps',
  })
  token: string;
}
