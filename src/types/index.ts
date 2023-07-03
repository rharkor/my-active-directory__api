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
    example: `{
      "statusCode": 400,
      "message": "User already exists",
      "error": "Bad Request"
    }`,
  })
  error: {
    statusCode: number;
    message?: string | string[];
    error: string;
  };
}
