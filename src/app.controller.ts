import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Request,
  Patch,
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
import { UsersService } from './modules/users/users.service';
import { UpdateUserDto } from './modules/users/dtos/updateUser.dto';
import { ApiAvailable } from './meta/api.meta';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Get()
  @Public()
  getStatus() {
    return this.appService.getStatus();
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Throttle(10, 60) //? 10 requests per 60 seconds
  @Post('auth/login')
  async login(@Body() user: LoginUserDto) {
    return this.authService.login(user);
  }

  @Public()
  @Post('auth/register-fist-time')
  async registerFirstTime(@Body() user: CreateFirstUserDto) {
    return this.authService.registerFirstTime(user);
  }

  @ApiAvailable()
  @Post('auth/register')
  async register(
    @Request() req: RequestWithUser | RequestWithServiceAccount,
    @Body() user: CreateUserDto,
  ) {
    return this.authService.register(user, req);
  }

  @ApiAvailable()
  @Patch('auth/update')
  async update(
    @Request() req: RequestWithUser | RequestWithServiceAccount,
    @Body() user: UpdateUserDto,
  ) {
    return this.userService.update(user, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get(['auth/profile', 'auth/me'])
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }
}
