import { ApiPaginationResponse } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import Project from '../entities/project.entity';

export class FindAllResponseDto extends ApiPaginationResponse {
  @ApiProperty({
    description: 'Projects',
    example: [
      {
        id: '1',
        name: 'super-admin',
        color: '#000000',
      },
    ],
  })
  data: Project[];
}
