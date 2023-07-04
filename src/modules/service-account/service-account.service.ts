import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ServiceAccount from './entities/service-account.entity';
import { CreateServiceAccountDto } from './dtos/service-account-create.dto';
import { UpdateServiceAccountDto } from './dtos/service-account-update.dto';
import { v4 as uuid } from 'uuid';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class ServiceAccountService {
  constructor(
    @InjectRepository(ServiceAccount)
    private serviceAccountRepository: Repository<ServiceAccount>,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<ServiceAccount>> {
    return paginate<ServiceAccount>(query, this.serviceAccountRepository, {
      sortableColumns: ['id', 'name'],
      filterableColumns: {
        id: true,
        name: true,
      },
    });
  }

  findOne(id: number) {
    return this.serviceAccountRepository.findOne({
      where: {
        id,
      },
    });
  }

  findApiKey(apiKey: string) {
    if (!apiKey) return Promise.resolve(null);
    return this.serviceAccountRepository.findOne({
      where: {
        token: apiKey,
      },
    });
  }

  async create(createServiceAccountDto: CreateServiceAccountDto) {
    try {
      return await this.serviceAccountRepository.save({
        ...createServiceAccountDto,
        token: uuid(),
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Service account already exists');
      }
      throw error;
    }
  }

  update(id: number, updateServiceAccountDto: UpdateServiceAccountDto) {
    return this.serviceAccountRepository.update(id, updateServiceAccountDto);
  }

  remove(id: number) {
    return this.serviceAccountRepository.delete(id);
  }
}
