import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './meta/public.meta';
import { AuthService } from './modules/auth/auth.service';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { LocalAuthGuard } from './modules/auth/local-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { LoginUserDto } from './modules/users/dtos/loginUser.dto';
import { CreateUserDto } from './modules/users/dtos/createUser.dto';
import { CreateFirstUserDto } from './modules/users/dtos/createFirstUser.dto';
import { RequestWithServiceAccount, RequestWithUser } from './types/auth';
import { ApiAvailable } from './meta/api.meta';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetStatusType } from './types';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  @Public()
  @ApiTags('app')
  @ApiOperation({ summary: 'Get status' })
  @ApiResponse({
    status: 200,
    description: 'Get status successful',
    type: GetStatusType,
  })
  getStatus(): GetStatusType {
    return this.appService.getStatus();
  }

  /*
   * Auth
   */

  @Public()
  @UseGuards(LocalAuthGuard)
  @Throttle(10, 60) //? 10 requests per 60 seconds
  @ApiTags('auth')
  @ApiOperation({
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
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @Post('auth/login')
  async login(@Body() user: LoginUserDto) {
    return this.authService.login(user);
  }

  @Public()
  @ApiTags('auth')
  @Post('auth/register-fist-time')
  async registerFirstTime(@Body() user: CreateFirstUserDto) {
    return this.authService.registerFirstTime(user);
  }

  @ApiAvailable()
  @ApiTags('auth')
  @Post('auth/register')
  async register(
    @Request() req: RequestWithUser | RequestWithServiceAccount,
    @Body() user: CreateUserDto,
  ) {
    return this.authService.register(user, req);
  }

  @UseGuards(JwtAuthGuard)
  @ApiTags('auth')
  @ApiBearerAuth()
  @Get(['auth/profile', 'auth/me'])
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }
}
