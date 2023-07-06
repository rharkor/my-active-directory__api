import { ApiPaginationResponse } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import User from '../entities/user.entity';

export class FindAllResponseDto extends ApiPaginationResponse {
  @ApiProperty({
    description: 'List of users',
    example: [
      {
        id: 1,
        email: 'admin@admin.com',
        username: 'admin',
        firstName: null,
        lastName: null,
        metadata: null,
      },
    ],
  })
  data: User[];
}
