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

@Controller('service-account')
export class ServiceAccountController {
  constructor(private readonly serviceAccountService: ServiceAccountService) {}

  @Get()
  findAll() {
    return this.serviceAccountService.findAll();
  }

  @Post()
  create(@Body() createServiceAccountDto: CreateServiceAccountDto) {
    return this.serviceAccountService.create(createServiceAccountDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceAccountDto: UpdateServiceAccountDto,
  ) {
    return this.serviceAccountService.update(id, updateServiceAccountDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviceAccountService.remove(id);
  }
}
