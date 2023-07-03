import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiAvailable } from '@/meta/api.meta';
import { RequestWithServiceAccount, RequestWithUser } from '@/types/auth';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiAvailable()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiAvailable()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne({
      id,
    });
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
