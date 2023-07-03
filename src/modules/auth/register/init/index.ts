import { AuthService } from '../../auth.service';
import { ApiErrorResponse, ApiRouteDocumentation } from '@/types';
import { CreateFirstUserDto } from '@/modules/users/dtos/createFirstUser.dto';
import { ApiProperty } from '@nestjs/swagger';

class Response201 {
  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInVzZXJuYW1lIjoiYWRtaW4iLCJmaXJzdE5hbWUiOm51bGwsImxhc3ROYW1lIjpudWxsLCJtZXRhZGF0YSI6bnVsbCwiaWQiOjcsInJvbGVzIjpbeyJpZCI6MiwibmFtZSI6InN1cGVyLWFkbWluIiwiZGlzcGxheU5hbWUiOiJTdXBlciBBZG1pbiIsImRlc2NyaXB0aW9uIjoiU3VwZXIgYWRtaW4gb2YgdGhlIGFwcGxpY2F0aW9uLCBjYW4gZG8gYW55dGhpbmciLCJkZWxldGFibGUiOmZhbHNlfV0sImlhdCI6MTY4ODEyMzQ2MSwiZXhwIjoxNjk4NDkxNDYxfQ.YIbz1hlsMVLQFwIpuBO99RVCjNY8GerOnWsCz9dYpwQ',
  })
  access_token: string;
}

class Response403 extends ApiErrorResponse {}

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
            $ref: '#/components/schemas/CreateFirstUserDto',
          },
        },
      },
    },
  });
  responses = () => [
    {
      status: 201,
      description: 'The user has been successfully registered.',
      type: Response201,
    },
    {
      status: 403,
      description: 'Forbidden because the first user has already been created.',
      type: Response403,
    },
  ];
}

const handler = ({
  user,
  authService,
}: {
  user: CreateFirstUserDto;
  authService: AuthService;
}) => authService.registerInit(user);

export const authRegisterInit = {
  handler,
  Documentation,
  Response: Response201,
};
