import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './middlewares/all-exceptions.middleware';
import * as swStats from 'swagger-stats';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AuthService } from './modules/auth/auth.service';
import { RolesService } from './modules/roles/roles.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const authService = app.get(AuthService);
  const rolesService = app.get(RolesService);
  const port = configService.getOrThrow('app_port');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Add Swagger documentation
  const options = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Useful information about the API')
    .setVersion(configService.getOrThrow('app_version'))
    .addBearerAuth()
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
      'x-api-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  const statsMiddleware = swStats.getMiddleware({
    swaggerSpec: document,
    uriPath: '/api/stats',
    authentication: true,
    onAuthenticate: async (req, username, password) => {
      try {
        const user = await authService.validateUser(
          {
            username,
          },
          password,
        );
        if (!user) return false;
        //? Retrieve user roles
        const roles = await rolesService.userHaveRole(
          user.id,
          ['super-admin'],
          true,
        );
        if (roles.length <= 0) return false;
        return true;
      } catch (e) {
        return false;
      }
    },
  });
  app.use(statsMiddleware);

  //? Enable CORS
  app.enableCors();
  //? Parse Cookies
  app.use(cookieParser());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  await app.listen(port);
}
bootstrap();
