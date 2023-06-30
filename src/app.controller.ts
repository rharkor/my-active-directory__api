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
import { RequestWithUser } from './types';
import { Throttle } from '@nestjs/throttler';
import { LoginUserDto } from './modules/users/dtos/loginUser.dto';
import { CreateUserDto } from './modules/users/dtos/createUser.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
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
  @Post('auth/register')
  @Throttle(10, 60) //? 10 requests per 60 seconds
  async register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(['auth/profile', 'auth/me'])
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }
}
