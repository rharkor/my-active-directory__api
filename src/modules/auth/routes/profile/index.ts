import { RequestWithUser } from '@/types/auth';
import { ApiRouteDocumentation } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import Role from '@/modules/roles/entities/role.entity';

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

  operation = () => ({
    summary: 'Register',
    description: 'Register a new user',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/CreateUserDto',
          },
        },
      },
    },
  });

  responses = () => [
    {
      status: 200,
      description: 'Success',
      type: Response200,
    },
  ];
}

const handler = ({ req }: { req: RequestWithUser }) => req.user;

export const authProfile = { handler, Documentation, Response: Response200 };
