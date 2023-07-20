import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configurations from './config';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { CronModule } from './modules/cron/cron.module';
import { UsersModule } from './modules/users/users.module';
import { ServiceAccountModule } from './modules/service-account/service-account.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiAuthGuard } from './modules/auth/api-auth.guard';
import { RolesProvider } from './guards/roles.guard';
import { RolesModule } from './modules/roles/roles.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { ProjectModule } from './modules/projects/project.module';

@Module({
  imports: [
    ...configurations,
    AuthModule,
    CronModule,
    UsersModule,
    RolesModule,
    ServiceAccountModule,
    UploadsModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ApiAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    RolesProvider,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
