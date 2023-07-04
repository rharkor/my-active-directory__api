import { ApiRouteDocumentation } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import Role from '@/modules/roles/entities/role.entity';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { UsersService } from '../../users.service';

class Response200 {
  @ApiProperty({
    name: 'Id',
    example: 1,
  })
  id: number;

  @ApiProperty({
    name: 'Email',
    example: 'test@mail.com',
  })
  email: string;

  @ApiProperty({
    name: 'Username',
    example: 'test',
  })
  username: string;

  @ApiProperty({
    name: 'First name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    name: 'Last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    name: 'Metadata',
    example: {
      key: 'value',
    },
  })
  metadata: unknown;

  @ApiProperty({
    name: 'Roles',
    example: [
      {
        id: 2,
        name: 'super-admin',
        displayName: 'Super Admin',
        description: 'Super admin of the application, can do anything',
      },
    ],
  })
  roles: Role[];
}

class Documentation implements ApiRouteDocumentation {
  bearerAuth = true;

  tags: () => string[];

  operation: () => Partial<OperationObject> = () => ({
    summary: 'Get one user',
    description: 'Retrieve one user by id',
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
  usersService,
}: {
  id: number;
  usersService: UsersService;
}) => usersService.findOne({ id });

export const combined = {
  handler,
  Documentation,
  Response: Response200,
};
