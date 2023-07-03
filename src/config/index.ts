import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfiguration from './app.configuration';
import databaseConfiguration from './database.configuration';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseType } from 'typeorm';

export default [
  ConfigModule.forRoot({
    load: [appConfiguration, databaseConfiguration],
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: configService.getOrThrow<
        (DatabaseType & 'aurora-mysql') | undefined
      >('db_kind'),
      host: configService.getOrThrow<string>('db_host'),
      port: configService.getOrThrow<number>('db_port'),
      username: configService.getOrThrow<string>('db_user'),
      password: configService.getOrThrow<string>('db_pass'),
      database: configService.getOrThrow<string>('db_name'),
      entities: [],
      autoLoadEntities: true,
    }),
  }),
  ThrottlerModule.forRoot({
    ttl: 60,
    limit: 30,
  }),
  ScheduleModule.forRoot(),
];
