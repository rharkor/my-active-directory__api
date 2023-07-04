import { ApiProperty, ApiResponseOptions } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export interface ApiRouteDocumentation {
  bearerAuth: boolean;

  tags: () => string[];
  operation: () => Partial<OperationObject>;
  responses: () => ApiResponseOptions[];
}

export class ApiErrorResponse {
  @ApiProperty({
    description: 'Status code',
    example: '400',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp',
    example: '2021-04-30T12:34:56.789Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Path',
    example: '/api/auth/register',
  })
  path: string;

  @ApiProperty({
    description: 'Error',
    example: {
      statusCode: 400,
      message: 'User already exists',
      error: 'Bad Request',
    },
  })
  error:
    | {
        statusCode: number;
        message?: string | string[];
        error: string;
      }
    | string;
}

export class ApiPaginationResponse {
  @ApiProperty({
    description: 'Meta',
    example: {
      itemsPerPage: 10,
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
    },
  })
  meta: {
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };

  @ApiProperty({
    description: 'Links',
    example: {
      first: '/api/roles?page=1&limit=10',
      previous: '/api/roles?page=1&limit=10',
      next: '/api/roles?page=1&limit=10',
      last: '/api/roles?page=1&limit=10',
      current: '/api/roles?page=1&limit=10',
    },
  })
  links: {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
    current: string;
  };
}
