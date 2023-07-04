import { ApiPaginationResponse, ApiRouteDocumentation } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { PaginateQuery } from 'nestjs-paginate';
import Role from '@/modules/roles/entities/role.entity';
import { RolesService } from '@/modules/roles/roles.service';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

class Response200 extends ApiPaginationResponse {
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

class Documentation implements ApiRouteDocumentation {
  bearerAuth = true;

  tags: () => string[];

  operation: () => Partial<OperationObject> = () => ({
    summary: 'Get all roles',
    description: 'Retrieve all roles of a user with pagination',
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
  id,
  query,
  rolesService,
}: {
  id: number;
  query: PaginateQuery;
  rolesService: RolesService;
}) => rolesService.findRoles(id, query);

export const usersFindRoles = {
  handler,
  Documentation,
  Response: Response200,
};
