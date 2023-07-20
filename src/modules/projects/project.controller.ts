import { Controller, Body, Param } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateDto } from './dtos/create.dto';
import { UpdateDto } from './dtos/update.dto';
import { HttpMethod, Route } from '@/meta/route.meta';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { FindAllResponseDto } from './dtos/find-all-response.dto';
import { FindAllNoPaginationResponseDto } from './dtos/find-all-no-pagination-response.dto';

@Controller('projects')
@ApiTags('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Route({
    method: HttpMethod.Get,
    roles: ['super-admin', 'admin'],
    swagger: {
      responses: {
        status: 200,
        description: 'Success',
        type: FindAllResponseDto,
      },
      operation: {
        summary: 'Get all',
        description: 'Retrieve all projects with pagination',
      },
    },
  })
  findAll(@Paginate() query: PaginateQuery): Promise<FindAllResponseDto> {
    return this.projectService.findAll(query);
  }

  @Route({
    method: HttpMethod.Get,
    path: 'no-pagination',
    roles: ['super-admin', 'admin'],
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
    return { data: await this.projectService.findAllNoPagination() };
  }

  @Route({
    method: HttpMethod.Get,
    roles: ['super-admin', 'admin'],
    path: ':id',
    swagger: {
      responses: {
        status: 200,
        description: 'Success',
      },
      operation: {
        summary: 'Get one',
        description: 'Retrieve one project',
      },
    },
  })
  findOne(@Param('id') id: number) {
    return this.projectService.findOne(id);
  }

  @Route({
    method: HttpMethod.Post,
    roles: ['super-admin', 'admin'],
    swagger: {
      responses: {
        status: 201,
        description: 'Project created',
      },
      operation: {
        summary: 'Create',
        description: 'Create a new project',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateDto',
              },
            },
          },
        },
      },
    },
  })
  create(@Body() createProjectDto: CreateDto) {
    return this.projectService.create(createProjectDto);
  }

  @Route({
    method: HttpMethod.Patch,
    path: ':id',
    roles: ['super-admin', 'admin'],
    swagger: {
      responses: {
        status: 200,
        description: 'Project updated',
      },
      operation: {
        summary: 'Update',
        description: 'Update a project',
      },
    },
  })
  update(@Param('id') id: number, @Body() updateProjectDto: UpdateDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Route({
    method: HttpMethod.Delete,
    path: ':id',
    roles: ['super-admin', 'admin'],
    swagger: {
      responses: {
        status: 200,
        description: 'Project deleted',
      },
      operation: {
        summary: 'Delete',
        description: 'Delete a project',
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
