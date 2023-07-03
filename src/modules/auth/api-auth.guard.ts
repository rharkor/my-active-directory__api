import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { IS_API_AVAILABLE } from '@/meta/api.meta';

@Injectable()
export class ApiAuthGuard {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const isApiAvailable = this.reflector.getAllAndOverride<boolean>(
      IS_API_AVAILABLE,
      [context.getHandler(), context.getClass()],
    );
    if (isApiAvailable && req.headers['x-api-key']) {
      const api = await this.authService.validateApi(
        req.headers['x-api-key'] as string,
      );
      //? Add the field api to the request
      req.api = api;
    }

    return true;
  }
}
