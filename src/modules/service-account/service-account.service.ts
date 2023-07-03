import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ServiceAccount from './entities/service-account.entity';
import { CreateServiceAccountDto } from './dtos/service-account-create.dto';
import { UpdateServiceAccountDto } from './dtos/service-account-update.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ServiceAccountService {
  constructor(
    @InjectRepository(ServiceAccount)
    private serviceAccountRepository: Repository<ServiceAccount>,
  ) {}

  findAll() {
    return this.serviceAccountRepository.find();
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

  create(createServiceAccountDto: CreateServiceAccountDto) {
    return this.serviceAccountRepository.save({
      ...createServiceAccountDto,
      token: uuid(),
    });
  }

  update(id: number, updateServiceAccountDto: UpdateServiceAccountDto) {
    return this.serviceAccountRepository.update(id, updateServiceAccountDto);
  }

  remove(id: number) {
    return this.serviceAccountRepository.delete(id);
  }
}
