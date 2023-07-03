import { RolesService } from '@/modules/roles/roles.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { RequestWithServiceAccount, RequestWithUser } from 'src/types/auth';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request: RequestWithUser | RequestWithServiceAccount = context
      .switchToHttp()
      .getRequest();

    console.log('here');

    if ('api' in request) {
      return roles.includes('service-account');
    }

    //* Check if user has the required role
    const { user } = request;
    if (!user) throw new ForbiddenException('Invalid credentials');
    const userRoles = await this.rolesService.userHaveRole(user.id, roles);
    if (userRoles.length > 0) return true;

    throw new ForbiddenException('You are not allowed to do this');
  }
}

export const RolesProvider = {
  provide: APP_GUARD,
  useClass: RolesGuard,
};
