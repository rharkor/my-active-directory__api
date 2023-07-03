import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import User from './entities/user.entity';
import Role from '../roles/entities/role.entity';
import { UsersController } from './users.controller';
import { RolesService } from '../roles/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UsersService, RolesService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
