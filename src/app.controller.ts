import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiProperty } from '@nestjs/swagger';
import { ApiRouteDocumentation } from './types';
import { Route } from './meta/route.meta';

export class GetStatusTypeResponse {
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

export class GetStatusType implements ApiRouteDocumentation {
  bearerAuth: boolean;
  tags = () => ['app'];
  operation = () => ({ summary: 'Get status' });
  responses = () => [
    {
      status: 200,
      description: 'Get status successful',
      type: GetStatusTypeResponse,
    },
  ];
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Route({
    isPublic: true,
    swagger: new GetStatusType(),
    method: 'get',
  })
  getStatus(): GetStatusTypeResponse {
    return this.appService.getStatus();
  }
}
