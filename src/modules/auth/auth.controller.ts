import { Controller, Get, UseGuards, Body, Request } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { JwtAuthGuard } from '../../modules/auth/jwt-auth.guard';
import { LocalAuthGuard } from '../../modules/auth/local-auth.guard';
import { LoginUserDto } from './routes/login/loginUser.dto';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { CreateFirstUserDto } from '../users/dtos/create-first-user.dto';
import { RequestWithServiceAccount, RequestWithUser } from '../../types/auth';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Route } from '@/meta/route.meta';
import { authRegister } from './routes/register';
import { authRegisterInit } from './routes/register/init';
import { authLogin, Response as authLoginResponse } from './routes/login';
import { authProfile } from './routes/profile';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Route({
    isPublic: true,
    useGuards: [LocalAuthGuard],
    throttle: [10, 60],
    swagger: new authLogin.Documentation(),
    method: 'post',
    path: 'login',
  })
  async login(@Body() user: LoginUserDto): Promise<authLoginResponse> {
    return authLogin.handler({ authService: this.authService, user });
  }

  @Route({
    isPublic: true,
    method: 'post',
    path: 'register/init',
    swagger: new authRegisterInit.Documentation(),
  })
  async registerInit(@Body() user: CreateFirstUserDto) {
    return authRegisterInit.handler({ user, authService: this.authService });
  }

  @Route({
    isApiAvailable: true,
    method: 'post',
    path: 'register',
    swagger: new authRegister.Documentation(),
    roles: ['admin', 'super-admin', 'service-account'],
  })
  async register(
    @Request() req: RequestWithUser | RequestWithServiceAccount,
    @Body() user: CreateUserDto,
  ) {
    return authRegister.handler({ req, user, authService: this.authService });
  }

  @Route({
    method: 'get',
    path: ['profile', 'me'],
    swagger: new authProfile.Documentation(),
  })
  getProfile(@Request() req: RequestWithUser) {
    return authProfile.handler({ req });
  }
}
