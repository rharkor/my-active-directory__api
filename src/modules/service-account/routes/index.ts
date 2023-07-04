import {
  ApiErrorResponse,
  ApiPaginationResponse,
  ApiRouteDocumentation,
} from '@/types';
import ServiceAccount from '../entities/service-account.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceAccountService } from '../service-account.service';
import { PaginateQuery } from 'nestjs-paginate';
import { CreateServiceAccountDto } from '../dtos/service-account-create.dto';

/*
 * findAll
 */
class Response200 extends ApiPaginationResponse {
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

class Documentation implements ApiRouteDocumentation {
  bearerAuth = true;

  tags: () => string[];

  operation = () => ({
    summary: 'Get all',
    description: 'Retrieve all service accounts with pagination',
  });

  responses = () => [
    {
      status: 200,
      description: 'Success',
      type: Response200,
    },
  ];
}

const handler = ({
  query,
  serviceAccountService,
}: {
  query: PaginateQuery;
  serviceAccountService: ServiceAccountService;
}) => serviceAccountService.findAll(query);

export const serviceAccountFindAll = {
  handler,
  Documentation,
  Response: Response200,
};

/*
 * Create
 */
class ResponseCreate201 {
  @ApiProperty({
    description: 'Id',
  })
  id: number;

  @ApiProperty({
    description: 'Name',
  })
  name: string;

  @ApiProperty({
    description: 'Token',
  })
  token: string;
}

class ApiCreateErrorResponse extends ApiErrorResponse {}

class DocumentationCreate implements ApiRouteDocumentation {
  bearerAuth = true;

  tags: () => string[];

  operation = () => ({
    summary: 'Create',
    description: 'Create a service account',
  });

  responses = () => [
    {
      status: 201,
      description: 'Success',
      type: ResponseCreate201,
    },
    {
      status: 400,
      description: 'Bad request',
      type: ApiCreateErrorResponse,
    },
  ];
}

const handlerCreate = ({
  createServiceAccountDto,
  serviceAccountService,
}: {
  createServiceAccountDto: CreateServiceAccountDto;
  serviceAccountService: ServiceAccountService;
}) => serviceAccountService.create(createServiceAccountDto);

export const serviceAccountCreate = {
  handler: handlerCreate,
  Documentation: DocumentationCreate,
  Response: ResponseCreate201,
};
