import { ApiPaginationResponse } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import Role from '../entities/role.entity';

export class FindAllResponseDto extends ApiPaginationResponse {
  @ApiProperty({
    description: 'Roles',
    example: [
      {
        id: '1',
        name: 'super-admin',
        displayName: 'Super admin',
        description: 'Super admin',
        color: '#000000',
      },
    ],
  })
  data: Role[];
}
