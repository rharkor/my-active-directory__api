import { Controller, Get, UseGuards, Body, Request } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { JwtAuthGuard } from '../../modules/auth/jwt-auth.guard';
import { LocalAuthGuard } from '../../modules/auth/local-auth.guard';
import { LoginUserDto } from './login/loginUser.dto';
import { CreateUserDto } from '../../modules/users/dtos/createUser.dto';
import { CreateFirstUserDto } from '../../modules/users/dtos/createFirstUser.dto';
import { RequestWithServiceAccount, RequestWithUser } from '../../types/auth';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Route } from '@/meta/route.meta';
import { authRegister } from './register';
import { authRegisterInit } from './register/init';
import { authLogin, Response as authLoginResponse } from './login';

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
  })
  async register(
    @Request() req: RequestWithUser | RequestWithServiceAccount,
    @Body() user: CreateUserDto,
  ) {
    return authRegister.handler({ req, user, authService: this.authService });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(['profile', 'me'])
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }
}
