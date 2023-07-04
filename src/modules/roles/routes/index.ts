import {
  ApiErrorResponse,
  ApiPaginationResponse,
  ApiRouteDocumentation,
} from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { RolesService } from '../roles.service';
import { PaginateQuery } from 'nestjs-paginate';
import Role from '../entities/role.entity';
import { CreateRoleDto } from '../dtos/create-role.dto';

/*
 * Find all
 */
class Response200 extends ApiPaginationResponse {
  @ApiProperty({
    description: 'Roles',
    example: [
      {
        id: '1',
        name: 'super-admin',
        displayName: 'Super admin',
        description: 'Super admin',
      },
    ],
  })
  data: Role[];
}

class Documentation implements ApiRouteDocumentation {
  bearerAuth = true;

  tags: () => string[];

  operation = () => ({
    summary: 'Get all',
    description: 'Retrieve all roles with pagination',
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
  rolesService,
}: {
  query: PaginateQuery;
  rolesService: RolesService;
}) => rolesService.findAllRoles(query);

export const rolesFindAll = { handler, Documentation, Response: Response200 };

/*
 * Find one
 */
class FindOneResponse200 {
  @ApiProperty({
    description: 'Id',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name',
    example: 'super-admin',
  })
  name: string;

  @ApiProperty({
    description: 'Display name',
    example: 'Super admin',
  })
  displayName: string;

  @ApiProperty({
    description: 'Description',
    example: 'Super admin',
  })
  description: string;
}

class DocumentationFindOne implements ApiRouteDocumentation {
  bearerAuth = true;

  tags: () => string[];

  operation = () => ({
    summary: 'Get one',
    description: 'Retrieve one role',
  });

  responses = () => [
    {
      status: 200,
      description: 'Success',
      type: FindOneResponse200,
    },
  ];
}

const handlerFindOne = ({
  id,
  rolesService,
}: {
  id: number;
  rolesService: RolesService;
}) => rolesService.findOne(id);

export const rolesFindOne = {
  handler: handlerFindOne,
  Documentation: DocumentationFindOne,
  Response: FindOneResponse200,
};

/*
 * Create
 */
class CreateResponse201 {
  @ApiProperty({
    description: 'Id',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name',
    example: 'super-admin',
  })
  name: string;

  @ApiProperty({
    description: 'Display name',
    example: 'Super admin',
  })
  displayName: string;

  @ApiProperty({
    description: 'Description',
    example: 'Super admin',
  })
  description: string;

  @ApiProperty({
    description: 'Deletable',
    example: true,
  })
  deletable: boolean;
}

class CreateRoleResponse400 extends ApiErrorResponse {}

class DocumentationCreate {
  bearerAuth = true;

  tags: () => string[];

  operation = () => ({
    summary: 'Create',
    description: 'Create a role',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/CreateRoleDto',
          },
        },
      },
    },
  });

  responses = () => [
    {
      status: 201,
      description: 'Role created',
      type: CreateResponse201,
    },
    {
      status: 400,
      description: 'Bad request',
      type: CreateRoleResponse400,
    },
  ];
}

const handlerCreate = ({
  createRoleDto,
  rolesService,
}: {
  createRoleDto: CreateRoleDto;
  rolesService: RolesService;
}) => rolesService.createRole(createRoleDto);

export const rolesCreate = {
  handler: handlerCreate,
  Documentation: DocumentationCreate,
  Response: CreateResponse201,
};
