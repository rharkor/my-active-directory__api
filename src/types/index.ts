import { ApiProperty } from '@nestjs/swagger';

export class GetStatusType {
  @ApiProperty({
    description: 'Status of the API',
    example: 'working',
  })
  status: string;

  @ApiProperty({
    description: 'Version of the API',
    example: '1.0.0',
  })
  version: string;
}
