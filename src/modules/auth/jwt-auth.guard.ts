import { IS_API_AVAILABLE } from '@/meta/api.meta';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/meta/public.meta';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private authService: AuthService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const isApiAvailable = this.reflector.getAllAndOverride<boolean>(
      IS_API_AVAILABLE,
      [context.getHandler(), context.getClass()],
    );
    if (isApiAvailable) {
      //? Check if X-Api-Key is present
      if (req.headers['x-api-key']) {
        return true;
      } else {
        return super.canActivate(context);
      }
    }

    return super.canActivate(context);
  }
}
