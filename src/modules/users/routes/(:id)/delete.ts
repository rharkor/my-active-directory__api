import { ApiRouteDocumentation } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { UsersService } from '../../users.service';
import { RequestWithServiceAccount, RequestWithUser } from '@/types/auth';

class Response200 {
  @ApiProperty({
    name: 'Raw',
    example: [],
  })
  raw: unknown[];

  @ApiProperty({
    name: 'Affected',
    example: 1,
  })
  affected: number;
}

class Documentation implements ApiRouteDocumentation {
  bearerAuth = true;

  tags: () => string[];

  operation: () => Partial<OperationObject> = () => ({
    summary: 'Delete',
    description: 'Delete one user',
  });

  responses = () => [
    {
      status: 200,
      description: 'User deleted',
      type: Response200,
    },
  ];
}

const handler = ({
  req,
  id,
  usersService,
}: {
  req: RequestWithUser | RequestWithServiceAccount;
  id: number;
  usersService: UsersService;
}) => usersService.delete(id, req);

export const combined = {
  handler,
  Documentation,
  Response: Response200,
};
