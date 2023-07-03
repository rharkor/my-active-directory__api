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
import { UpdateUserDto } from './dtos/updateUser.dto';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import Role from '../roles/entities/role.entity';
import { RolesService } from '../roles/roles.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  @Get()
  @ApiAvailable()
  findAll(@Paginate() query: PaginateQuery) {
    return this.usersService.findAll(query);
  }

  @Get(':id/roles')
  @ApiAvailable()
  findRoles(
    @Param('id', ParseIntPipe) id: number,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Role>> {
    return this.rolesService.findRoles(id, query);
  }

  @Get(':id')
  @ApiAvailable()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne({
      id,
    });
  }

  @ApiAvailable()
  @Patch(':id')
  async update(
    @Request() req: RequestWithUser | RequestWithServiceAccount,
    @Body() user: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.update(id, user, req);
  }

  @Delete(':id')
  @ApiAvailable()
  delete(
    @Request() req: RequestWithUser | RequestWithServiceAccount,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.delete(id, req);
  }
}
