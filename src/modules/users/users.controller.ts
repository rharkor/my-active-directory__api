import { Controller, Param, ParseIntPipe, Request, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { RequestWithServiceAccount, RequestWithUser } from '@/types/auth';
import { UpdateDto } from './dtos/update.dto';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import Role from '../roles/entities/role.entity';
import { RolesService } from '../roles/roles.service';
import { ApiTags } from '@nestjs/swagger';
import { HttpMethod, Route } from '@/meta/route.meta';
import { FindAllResponseDto } from './dtos/find-all-response.dto';
import { FindRolesResponseDto } from './dtos/find-roles-response.dto';
import { FindOneResponseDto } from './dtos/find-one-response.dto';
import { UpdateResponseDto } from './dtos/update-response.dto';
import { RemoveResponseDto } from './dtos/remove-response.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  @Route({
    isApiAvailable: true,
    method: HttpMethod.Get,
    swagger: {
      responses: {
        status: 200,
        description: 'Success',
        type: FindAllResponseDto,
      },
      operation: {
        summary: 'Get all',
        description: 'Retrieve all users with pagination',
      },
    },
  })
  findAll(@Paginate() query: PaginateQuery): Promise<FindAllResponseDto> {
    return this.usersService.findAll(query);
  }

  @Route({
    isApiAvailable: true,
    method: HttpMethod.Get,
    path: ':id/roles',
    swagger: {
      responses: {
        status: 200,
        description: 'Success',
        type: FindRolesResponseDto,
      },
      operation: {
        summary: 'Get all roles',
        description: 'Retrieve all roles of a user with pagination',
      },
    },
  })
  findRoles(
    @Param('id', ParseIntPipe) id: number,
    @Paginate() query: PaginateQuery,
  ): Promise<FindRolesResponseDto> {
    return this.rolesService.findByUser(id, query);
  }

  @Route({
    isApiAvailable: true,
    method: HttpMethod.Get,
    path: ':id',
    swagger: {
      responses: {
        status: 200,
        description: 'Success',
        type: FindOneResponseDto,
      },
      operation: {
        summary: 'Get one user',
        description: 'Retrieve one user by id',
      },
    },
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FindOneResponseDto | null> {
    return this.usersService.findOne(id);
  }

  @Route({
    isApiAvailable: true,
    method: HttpMethod.Patch,
    path: ':id',
    swagger: {
      responses: {
        status: 200,
        description: 'Success',
        type: UpdateResponseDto,
      },
      operation: {
        summary: 'Update',
        description: 'Update one user',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateDto',
              },
            },
          },
        },
      },
    },
  })
  update(
    @Request() req: RequestWithUser | RequestWithServiceAccount,
    @Body() user: UpdateDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UpdateResponseDto> {
    return this.usersService.update(id, user, req);
  }

  @Route({
    isApiAvailable: true,
    method: HttpMethod.Delete,
    path: ':id',
    swagger: {
      responses: {
        status: 200,
        description: 'User deleted',
        type: RemoveResponseDto,
      },
      operation: {
        summary: 'Delete',
        description: 'Delete one user',
      },
    },
  })
  remove(
    @Request() req: RequestWithUser | RequestWithServiceAccount,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RemoveResponseDto> {
    return this.usersService.remove(id, req);
  }
}
