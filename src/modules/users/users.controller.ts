import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Request,
  Patch,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiAvailable } from '@/meta/api.meta';
import { RequestWithServiceAccount, RequestWithUser } from '@/types/auth';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import Role from '../roles/entities/role.entity';
import { RolesService } from '../roles/roles.service';
import { ApiTags } from '@nestjs/swagger';
import { Route } from '@/meta/route.meta';
import { usersFindAll } from './routes';
import { usersFindRoles } from './routes/(:id)/roles';
import { usersDelete, usersFindOne, usersUpdate } from './routes/(:id)';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  @Route({
    isApiAvailable: true,
    method: 'get',
    swagger: new usersFindAll.Documentation(),
  })
  findAll(@Paginate() query: PaginateQuery) {
    return usersFindAll.handler({ usersService: this.usersService, query });
  }

  @Route({
    isApiAvailable: true,
    method: 'get',
    path: ':id/roles',
    swagger: new usersFindRoles.Documentation(),
  })
  findRoles(
    @Param('id', ParseIntPipe) id: number,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Role>> {
    return usersFindRoles.handler({
      id,
      query,
      rolesService: this.rolesService,
    });
  }

  @Route({
    isApiAvailable: true,
    method: 'get',
    path: ':id',
    swagger: new usersFindOne.Documentation(),
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return usersFindOne.handler({ id, usersService: this.usersService });
  }

  @Route({
    isApiAvailable: true,
    method: 'patch',
    path: ':id',
    swagger: new usersUpdate.Documentation(),
  })
  update(
    @Request() req: RequestWithUser | RequestWithServiceAccount,
    @Body() user: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return usersUpdate.handler({
      id,
      user,
      usersService: this.usersService,
      req,
    });
  }

  @Route({
    isApiAvailable: true,
    method: 'delete',
    path: ':id',
    swagger: new usersDelete.Documentation(),
  })
  delete(
    @Request() req: RequestWithUser | RequestWithServiceAccount,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return usersDelete.handler({ id, usersService: this.usersService, req });
  }
}
