import { ApiProperty } from '@nestjs/swagger';

export class CreateResponseDto {
  @ApiProperty({
    description: 'Id',
  })
  id: number;

  @ApiProperty({
    description: 'Name',
  })
  name: string;

  @ApiProperty({
    description: 'Token',
  })
  token: string;
}
