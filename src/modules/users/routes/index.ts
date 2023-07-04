import { ApiPaginationResponse, ApiRouteDocumentation } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { PaginateQuery } from 'nestjs-paginate';
import User from '../entities/user.entity';
import { UsersService } from '../users.service';

class Response200 extends ApiPaginationResponse {
  @ApiProperty({
    description: 'List of users',
    example: [
      {
        id: 1,
        email: 'admin@admin.com',
        username: 'admin',
        firstName: null,
        lastName: null,
        metadata: null,
      },
    ],
  })
  data: User[];
}

class Documentation implements ApiRouteDocumentation {
  bearerAuth = true;

  tags: () => string[];

  operation = () => ({
    summary: 'Get all',
    description: 'Retrieve all users with pagination',
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
  usersService,
}: {
  query: PaginateQuery;
  usersService: UsersService;
}) => usersService.findAll(query);

export const usersFindAll = {
  handler,
  Documentation,
  Response: Response200,
};
