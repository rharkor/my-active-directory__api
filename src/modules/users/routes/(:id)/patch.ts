import { ApiRouteDocumentation } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import Role from '@/modules/roles/entities/role.entity';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { UsersService } from '../../users.service';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { RequestWithServiceAccount, RequestWithUser } from '@/types/auth';

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
}

class Documentation implements ApiRouteDocumentation {
  bearerAuth = true;

  tags: () => string[];

  operation: () => Partial<OperationObject> = () => ({
    summary: 'Update',
    description: 'Update one user',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UpdateUserDto',
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

const handler = ({
  req,
  id,
  usersService,
  user,
}: {
  req: RequestWithUser | RequestWithServiceAccount;
  id: number;
  usersService: UsersService;
  user: UpdateUserDto;
}) => usersService.update(id, user, req);

export const combined = {
  handler,
  Documentation,
  Response: Response200,
};
