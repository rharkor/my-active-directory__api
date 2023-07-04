import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfiguration from './app.configuration';
import databaseConfiguration from './database.configuration';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseType } from 'typeorm';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { Redis } from 'ioredis';
import redisConfiguration from './redis.configuration';

export default [
  ConfigModule.forRoot({
    load: [appConfiguration, databaseConfiguration, redisConfiguration],
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
  ThrottlerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      ttl: 60,
      limit: 30,

      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: configService.getOrThrow<string>('redis_host'),
          port: configService.getOrThrow<number>('redis_port'),
          password: configService.get<string | undefined>('redis_pass'),
          username: configService.get<string | undefined>('redis_user'),
        }),
      ),
    }),
  }),
  ScheduleModule.forRoot(),
];
