import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { ServiceAccountService } from './service-account.service';
import { CreateServiceAccountDto } from './dtos/service-account-create.dto';
import { UpdateServiceAccountDto } from './dtos/service-account-update.dto';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { serviceAccountCreate, serviceAccountFindAll } from './routes';
import { Route } from '@/meta/route.meta';
import {
  serviceAccountFindOne,
  serviceAccountRemove,
  serviceAccountUpdate,
} from './routes/(:id)';

@Controller('service-account')
@ApiTags('service-account')
export class ServiceAccountController {
  constructor(private readonly serviceAccountService: ServiceAccountService) {}

  @Route({
    method: 'get',
    roles: ['super-admin', 'admin'],
    swagger: new serviceAccountFindAll.Documentation(),
  })
  findAll(@Paginate() query: PaginateQuery) {
    return serviceAccountFindAll.handler({
      query,
      serviceAccountService: this.serviceAccountService,
    });
  }

  @Route({
    method: 'get',
    roles: ['super-admin', 'admin'],
    path: ':id',
    swagger: new serviceAccountFindOne.Documentation(),
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return serviceAccountFindOne.handler({
      id,
      serviceAccountService: this.serviceAccountService,
    });
  }

  @Route({
    method: 'post',
    roles: ['super-admin', 'admin'],
    swagger: new serviceAccountCreate.Documentation(),
  })
  create(@Body() createServiceAccountDto: CreateServiceAccountDto) {
    return serviceAccountCreate.handler({
      createServiceAccountDto,
      serviceAccountService: this.serviceAccountService,
    });
  }

  @Route({
    method: 'patch',
    roles: ['super-admin', 'admin'],
    path: ':id',
    swagger: new serviceAccountUpdate.Documentation(),
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceAccountDto: UpdateServiceAccountDto,
  ) {
    return serviceAccountUpdate.handler({
      id,
      updateServiceAccountDto,
      serviceAccountService: this.serviceAccountService,
    });
  }

  @Route({
    method: 'delete',
    roles: ['super-admin', 'admin'],
    path: ':id',
    swagger: new serviceAccountRemove.Documentation(),
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return serviceAccountRemove.handler({
      id,
      serviceAccountService: this.serviceAccountService,
    });
  }
}
