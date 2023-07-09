import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import User from './entities/user.entity';
import Role from '../roles/entities/role.entity';
import { UsersController } from './users.controller';
import { RolesService } from '../roles/roles.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import Token from '../auth/entities/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Token]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  providers: [UsersService, RolesService, JwtStrategy],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
