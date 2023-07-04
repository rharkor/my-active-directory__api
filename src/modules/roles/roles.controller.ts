import { Body, Controller, Param, ParseIntPipe } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Route } from '@/meta/route.meta';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { rolesFindAll, rolesFindOne, rolesCreate } from './routes';
import { ApiTags } from '@nestjs/swagger';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Route({
    method: 'get',
    isApiAvailable: true,
    roles: ['super-admin', 'admin', 'service-account'],
    swagger: new rolesFindAll.Documentation(),
  })
  findAll(@Paginate() query: PaginateQuery) {
    return rolesFindAll.handler({ query, rolesService: this.rolesService });
  }

  @Route({
    method: 'get',
    path: ':id',
    isApiAvailable: true,
    roles: ['super-admin', 'admin', 'service-account'],
    swagger: new rolesFindOne.Documentation(),
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return rolesFindOne.handler({ id, rolesService: this.rolesService });
  }

  @Route({
    method: 'post',
    isApiAvailable: true,
    roles: ['super-admin', 'admin', 'service-account'],
    swagger: new rolesCreate.Documentation(),
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return rolesCreate.handler({
      createRoleDto,
      rolesService: this.rolesService,
    });
  }
}
