import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import ServiceAccount from './entities/service-account.entity';
import { CreateServiceAccountDto } from './dtos/create.dto';
import { UpdateServiceAccountDto } from './dtos/update.dto';
import { v4 as uuid } from 'uuid';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { CreateServiceAccountDtoFilled } from './dtos/create-filled.dto';
import { UpdateServiceAccountDtoFilled } from './dtos/update-filled.dto';
import Project from '../projects/entities/project.entity';

@Injectable()
export class ServiceAccountService {
  constructor(
    @InjectRepository(ServiceAccount)
    private serviceAccountRepository: Repository<ServiceAccount>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
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
      const createServiceAccountDtoFilled: CreateServiceAccountDtoFilled = {
        ...createServiceAccountDto,
        projects: undefined,
      };
      //? If projects is not empty, then we need to find the projects
      if (createServiceAccountDto.projects?.length) {
        const projects = await this.projectsRepository.find({
          where: {
            name: In(createServiceAccountDto.projects),
          },
          select: ['id'],
        });
        if (projects.length !== createServiceAccountDto.projects.length) {
          throw new BadRequestException('Invalid projects');
        }
        createServiceAccountDtoFilled.projects = projects;
      }

      return await this.serviceAccountRepository.save({
        ...createServiceAccountDtoFilled,
        token: uuid(),
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Service account already exists');
      }
      throw error;
    }
  }

  async update(id: number, updateServiceAccountDto: UpdateServiceAccountDto) {
    const updateServiceAccountDtoFilled: UpdateServiceAccountDtoFilled = {
      ...updateServiceAccountDto,
      projects: undefined,
    };
    //? If projects is not empty, then we need to find the projects
    if (updateServiceAccountDto.projects?.length) {
      const projects = await this.projectsRepository.find({
        where: {
          name: In(updateServiceAccountDto.projects),
        },
        select: ['id'],
      });
      if (projects.length !== updateServiceAccountDto.projects.length) {
        throw new BadRequestException('Invalid projects');
      }
      updateServiceAccountDtoFilled.projects = projects;
    }

    return this.serviceAccountRepository.update(
      id,
      updateServiceAccountDtoFilled,
    );
  }

  async updateToken(id: number) {
    const token = uuid();
    await this.serviceAccountRepository.update(id, {
      token,
    });
    return { token };
  }

  remove(id: number) {
    return this.serviceAccountRepository.delete(id);
  }
}
