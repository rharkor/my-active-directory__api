import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapter: AbstractHttpAdapter) {}

  catch(exception: HttpException | string, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (
      httpStatus === HttpStatus.INTERNAL_SERVER_ERROR ||
      process.env.NODE_ENV !== 'production'
    ) {
      console.error(exception);
    }

    const responseBody: {
      statusCode: number;
      timestamp: string;
      path: string;
      error: string | object;
    } = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: this.httpAdapter.getRequestUrl(ctx.getRequest()),
      error: exception.toString(),
    };

    if (exception instanceof HttpException && exception.message) {
      responseBody.error = exception.getResponse();
    }

    Logger.error(exception);

    this.httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
