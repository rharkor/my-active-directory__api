import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiProperty } from '@nestjs/swagger';
import { HttpMethod, Route } from './meta/route.meta';

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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Route({
    isPublic: true,
    swagger: {
      operation: {
        summary: 'Get status',
      },
      responses: {
        status: 200,
        description: 'Get status successful',
        type: GetStatusTypeResponse,
      },
    },
    method: HttpMethod.Get,
  })
  getStatus(): GetStatusTypeResponse {
    return this.appService.getStatus();
  }
}
