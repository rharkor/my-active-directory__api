import { Body, Controller, Param, ParseIntPipe } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { HttpMethod, Route } from '@/meta/route.meta';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dtos/create.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindAllResponseDto } from './dtos/find-all-response.dto';
import { FindOneResponseDto } from './dtos/find-one-response.dto';
import { CreateResponseDto } from './dtos/create-response.dto';
import { ApiErrorResponse } from '@/types';

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
  create(@Body() createRoleDto: CreateRoleDto): Promise<CreateResponseDto> {
    return this.rolesService.create(createRoleDto);
  }
}
