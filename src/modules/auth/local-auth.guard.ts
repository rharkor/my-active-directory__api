import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  /* On login, sleep for 500 ms to slow down brute force attacks */
  async canActivate(context: ExecutionContext): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return super.canActivate(context);
  }
}
