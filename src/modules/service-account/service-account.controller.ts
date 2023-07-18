import { Controller, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ServiceAccountService } from './service-account.service';
import { CreateServiceAccountDto } from './dtos/create.dto';
import { UpdateServiceAccountDto } from './dtos/update.dto';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { HttpMethod, Route } from '@/meta/route.meta';
import { FindAllResponseDto } from './dtos/find-all-response.dto';
import { CreateResponseDto } from './dtos/create-response.dto';
import { ApiErrorResponse } from '@/types';
import { FindOneResponseDto } from './dtos/find-one-response.dto';
import { UpdateResponseDto } from './dtos/update-response.dto';
import { RemoveResponseDto } from './dtos/remove-response.dto';

@Controller('service-accounts')
@ApiTags('service-accounts')
export class ServiceAccountController {
  constructor(private readonly serviceAccountService: ServiceAccountService) {}

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
        description: 'Retrieve all service accounts with pagination',
      },
    },
  })
  findAll(@Paginate() query: PaginateQuery): Promise<FindAllResponseDto> {
    return this.serviceAccountService.findAll(query);
  }

  @Route({
    method: HttpMethod.Get,
    roles: ['super-admin', 'admin'],
    path: ':id',
    swagger: {
      responses: {
        status: 200,
        description: 'Success',
        type: FindOneResponseDto,
      },
      operation: {
        summary: 'Find one',
        description: 'Retrieve one service account',
      },
    },
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FindOneResponseDto | null> {
    return this.serviceAccountService.findOne(id);
  }

  @Route({
    method: HttpMethod.Post,
    roles: ['super-admin', 'admin'],
    swagger: {
      responses: [
        {
          status: 201,
          description: 'Success',
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
        description: 'Create a service account',
      },
    },
  })
  create(
    @Body() createServiceAccountDto: CreateServiceAccountDto,
  ): Promise<CreateResponseDto> {
    return this.serviceAccountService.create(createServiceAccountDto);
  }

  @Route({
    method: HttpMethod.Patch,
    roles: ['super-admin', 'admin'],
    path: ':id',
    swagger: {
      responses: {
        status: 200,
        description: 'Success',
        type: UpdateResponseDto,
      },
      operation: {
        summary: 'Update',
        description: 'Update one service account',
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceAccountDto: UpdateServiceAccountDto,
  ): Promise<UpdateResponseDto> {
    return this.serviceAccountService.update(id, updateServiceAccountDto);
  }

  @Route({
    method: HttpMethod.Delete,
    roles: ['super-admin', 'admin'],
    path: ':id',
    swagger: {
      responses: {
        status: 200,
        description: 'Success',
        type: RemoveResponseDto,
      },
      operation: {
        summary: 'Remove',
        description: 'Remove a service account',
      },
    },
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<RemoveResponseDto> {
    return this.serviceAccountService.remove(id);
  }
}
