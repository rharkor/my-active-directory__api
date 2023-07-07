import { Controller, Body, Request } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { CreateDto as CreateUserDto } from '../users/dtos/create.dto';
import { CreateFirstDto as CreateFirstUserDto } from '../users/dtos/create-first.dto';
import { RequestWithServiceAccount, RequestWithUser } from '../../types/auth';
import { ApiTags } from '@nestjs/swagger';
import { HttpMethod, Route } from '@/meta/route.meta';
import { LoginResponseDto } from './dtos/login-response.dto';
import { RegisterResponseDto } from './dtos/register-response.dto';
import { ApiErrorResponse } from '@/types';
import { ProfileResponseDto } from './dtos/profile-response.dto';
import { InitializedResponseDto } from './dtos/initialized-response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Route({
    isPublic: true,
    method: HttpMethod.Post,
    path: 'login',
    // useGuards: [LocalAuthGuard],
    throttle: [10, 60],
    swagger: {
      responses: {
        status: 200,
        description: 'Login successful',
        type: LoginResponseDto,
      },
      operation: {
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
      },
    },
  })
  login(@Body() user: LoginUserDto): Promise<LoginResponseDto> {
    return this.authService.login(user);
  }

  @Route({
    isPublic: true,
    method: HttpMethod.Get,
    path: 'initialized',
    swagger: {
      responses: {
        status: 200,
        description: 'Returns true if the first user has been created',
        type: InitializedResponseDto,
      },
      operation: {
        summary: 'Initialized',
        description: 'Returns true if the first user has been created',
      },
    },
  })
  initialized(): Promise<InitializedResponseDto> {
    return this.authService.initialized();
  }

  @Route({
    isPublic: true,
    method: HttpMethod.Post,
    path: 'register/init',
    swagger: {
      responses: [
        {
          status: 201,
          description: 'The user has been successfully registered.',
          type: RegisterResponseDto,
        },
        {
          status: 403,
          description:
            'Forbidden because the first user has already been created.',
          type: ApiErrorResponse,
        },
      ],
      operation: {
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
      },
    },
  })
  registerInit(@Body() user: CreateFirstUserDto): Promise<RegisterResponseDto> {
    return this.authService.registerInit(user);
  }

  @Route({
    isApiAvailable: true,
    method: HttpMethod.Post,
    path: 'register',
    swagger: {
      responses: [
        {
          status: 201,
          description: 'The user has been successfully registered.',
          type: RegisterResponseDto,
        },
        {
          status: 400,
          description: 'Bad request.',
          type: ApiErrorResponse,
        },
      ],
      operation: {
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
      },
    },
    roles: ['admin', 'super-admin', 'service-account'],
  })
  register(
    @Request() req: RequestWithUser | RequestWithServiceAccount,
    @Body() user: CreateUserDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(user, req);
  }

  @Route({
    method: HttpMethod.Get,
    path: ['profile', 'me'],
    swagger: {
      responses: {
        status: 200,
        description: 'Get profile successful',
        type: ProfileResponseDto,
      },
    },
  })
  getProfile(@Request() req: RequestWithUser): ProfileResponseDto {
    return req.user;
  }
}
