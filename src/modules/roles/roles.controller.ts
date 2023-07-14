import { Body, Controller, Param, ParseIntPipe } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { HttpMethod, Route } from '@/meta/route.meta';
import { RolesService } from './roles.service';
import { ApiTags } from '@nestjs/swagger';
import { FindAllResponseDto } from './dtos/find-all-response.dto';
import { FindOneResponseDto } from './dtos/find-one-response.dto';
import { CreateResponseDto } from './dtos/create-response.dto';
import { ApiErrorResponse } from '@/types';
import { DeleteResult } from 'typeorm';
import { UpdateDto } from './dtos/update.dto';
import { CreateDto } from './dtos/create.dto';
import Role from './entities/role.entity';
import { FindAllNoPaginationResponseDto } from './dtos/find-all-no-pagination-response.dto';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Route({
    method: HttpMethod.Get,
    isApiAvailable: true,
    roles: ['super-admin', 'admin', 'service-account'],
    swagger: {
      responses: {
        status: 200,
        description: 'Success',
        type: FindAllResponseDto,
      },
      operation: {
        summary: 'Get all',
        description: 'Retrieve all roles with pagination',
      },
    },
  })
  findAll(@Paginate() query: PaginateQuery): Promise<FindAllResponseDto> {
    return this.rolesService.findAll(query);
  }

  @Route({
    method: HttpMethod.Get,
    path: 'no-pagination',
    isApiAvailable: true,
    roles: ['super-admin', 'admin', 'service-account'],
    swagger: {
      responses: {
        status: 200,
        description: 'Success',
        type: FindAllNoPaginationResponseDto,
      },
      operation: {
        summary: 'Get all no pagination',
        description: 'Retrieve all roles without pagination',
      },
    },
  })
  async findAllNoPagination(): Promise<FindAllNoPaginationResponseDto> {
    return { data: await this.rolesService.findAllNoPagination() };
  }

  @Route({
    method: HttpMethod.Get,
    path: ':id',
    isApiAvailable: true,
    roles: ['super-admin', 'admin', 'service-account'],
    swagger: {
      responses: {
        status: 200,
        description: 'Success',
        type: FindOneResponseDto,
      },
      operation: {
        summary: 'Get one',
        description: 'Retrieve one role',
      },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<FindOneResponseDto> {
    return this.rolesService.findOne(id);
  }

  @Route({
    method: HttpMethod.Post,
    isApiAvailable: true,
    roles: ['super-admin', 'admin', 'service-account'],
    swagger: {
      responses: [
        {
          status: 201,
          description: 'Role created',
          type: CreateResponseDto,
        },
        {
          status: 400,
          description: 'Bad request',
          type: ApiErrorResponse,
        },
      ],
      operation: {
        summary: 'Create',
        description: 'Create a role',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateRoleDto',
              },
            },
          },
        },
      },
    },
  })
  create(@Body() createDto: CreateDto): Promise<CreateResponseDto> {
    return this.rolesService.create(createDto);
  }

  @Route({
    method: HttpMethod.Patch,
    path: ':id',
    isApiAvailable: true,
    roles: ['super-admin', 'admin', 'service-account'],
    swagger: {
      responses: [
        {
          status: 200,
          description: 'Role updated',
        },
        {
          status: 400,
          description: 'Bad request',
          type: ApiErrorResponse,
        },
      ],
      operation: {
        summary: 'Update',
        description: 'Update a role',
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDto,
  ): Promise<Role> {
    return this.rolesService.update(id, updateDto);
  }

  @Route({
    method: HttpMethod.Delete,
    path: ':id',
    isApiAvailable: true,
    roles: ['super-admin', 'admin', 'service-account'],
    swagger: {
      responses: [
        {
          status: 200,
          description: 'Role deleted',
        },
        {
          status: 400,
          description: 'Bad request',
          type: ApiErrorResponse,
        },
      ],
      operation: {
        summary: 'Delete',
        description: 'Delete a role',
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.rolesService.delete(id);
  }
}
