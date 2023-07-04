import { LoginUserDto } from '../login/loginUser.dto';
import { AuthService } from '../../auth.service';
import { ApiRouteDocumentation } from '@/types';
import { ApiProperty } from '@nestjs/swagger';

export class Response {
  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInVzZXJuYW1lIjoiYWRtaW4iLCJmaXJzdE5hbWUiOm51bGwsImxhc3ROYW1lIjpudWxsLCJtZXRhZGF0YSI6bnVsbCwiaWQiOjcsInJvbGVzIjpbeyJpZCI6MiwibmFtZSI6InN1cGVyLWFkbWluIiwiZGlzcGxheU5hbWUiOiJTdXBlciBBZG1pbiIsImRlc2NyaXB0aW9uIjoiU3VwZXIgYWRtaW4gb2YgdGhlIGFwcGxpY2F0aW9uLCBjYW4gZG8gYW55dGhpbmciLCJkZWxldGFibGUiOmZhbHNlfV0sImlhdCI6MTY4ODEyMzQ2MSwiZXhwIjoxNjk4NDkxNDYxfQ.YIbz1hlsMVLQFwIpuBO99RVCjNY8GerOnWsCz9dYpwQ',
  })
  access_token: string;
}

export class Documentation implements ApiRouteDocumentation {
  bearerAuth: boolean;
  tags: () => string[];
  operation = () => ({
    summary: 'Login',
    description: 'Login with username or email and password',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/LoginUserDto',
          },
        },
      },
    },
  });
  responses = () => [
    {
      status: 200,
      description: 'Login successful',
      type: Response,
    },
  ];
}

export const handler = ({
  authService,
  user,
}: {
  authService: AuthService;
  user: LoginUserDto;
}) => authService.login(user);

export const authLogin = { handler, Documentation, Response };
