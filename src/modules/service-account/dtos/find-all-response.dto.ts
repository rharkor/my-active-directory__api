import { ApiPaginationResponse } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import ServiceAccount from '../entities/service-account.entity';

export class FindAllResponseDto extends ApiPaginationResponse {
  @ApiProperty({
    description: 'Service accounts',
    example: [
      {
        id: '1',
        name: 'service-account1',
      },
    ],
  })
  data: ServiceAccount[];
}
