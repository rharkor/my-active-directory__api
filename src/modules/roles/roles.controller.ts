import { Controller } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Route } from '@/meta/route.meta';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Route({
    method: 'get',
    isApiAvailable: true,
    roles: ['super-admin', 'admin', 'service-account'],
  })
  findAll(@Paginate() query: PaginateQuery) {
    return this.rolesService.findAllRoles(query);
  }
}
