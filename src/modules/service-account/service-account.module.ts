import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceAccountController } from './service-account.controller';
import { ServiceAccountService } from './service-account.service';
import ServiceAccount from './entities/service-account.entity';
import Project from '../projects/entities/project.entity';

@Module({
  controllers: [ServiceAccountController],
  providers: [ServiceAccountService],
  imports: [TypeOrmModule.forFeature([ServiceAccount, Project])],
  exports: [ServiceAccountService],
})
export class ServiceAccountModule {}
