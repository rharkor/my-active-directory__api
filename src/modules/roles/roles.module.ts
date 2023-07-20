import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import Role from './entities/role.entity';
import { RolesController } from './roles.controller';
import User from '../users/entities/user.entity';
import SysRole from './entities/sys-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, SysRole, User])],
  providers: [RolesService],
  exports: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
