import Role from '@/modules/roles/entities/role.entity';
import { ApiPaginationResponse } from '@/types';
import { ApiProperty } from '@nestjs/swagger';

export class FindRolesResponseDto extends ApiPaginationResponse {
  @ApiProperty({
    description: 'List of roles',
    example: [
      {
        id: 5,
        name: 'test',
        displayName: 'test',
        description: 'test',
      },
    ],
  })
  data: Role[];
}
