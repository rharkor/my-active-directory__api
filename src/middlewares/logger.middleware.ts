import { PayloadType } from '@/types/auth';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import jwtDecode from 'jwt-decode';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl: url } = request;
    const userAgent = request.get('user-agent') || '';

    let additionalInfo = '';
    if (process.env.NODE_ENV !== 'production') {
      const cookies = request.cookies;
      const accessToken = cookies['mad-session'];
      let decodedAccessToken: PayloadType | null = null;
      try {
        if (accessToken) decodedAccessToken = jwtDecode(accessToken);
      } catch (error) {}
      const refreshToken = cookies['mad-refresh'];
      let decodedRefreshToken: PayloadType | null = null;
      try {
        if (refreshToken) decodedRefreshToken = jwtDecode(refreshToken);
      } catch (error) {}

      const bearerToken = request.get('authorization')?.split(' ')[1];
      let decodedBearerToken: PayloadType | null = null;
      try {
        if (bearerToken) decodedBearerToken = jwtDecode(bearerToken);
      } catch (error) {}

      const user =
        decodedAccessToken ?? decodedRefreshToken ?? decodedBearerToken;

      additionalInfo +=
        user?.email ?? user?.username ?? user?.id ?? 'anonymous';
    }

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method} ${url} ${statusCode} ${
          contentLength ?? ''
        } - ${userAgent} ${ip} ${additionalInfo}`,
      );
    });

    next();
  }
}
