import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Project from './entities/project.entity';
import { CreateDto } from './dtos/create.dto';
import { UpdateDto } from './dtos/update.dto';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Project>> {
    return paginate<Project>(query, this.projectRepository, {
      sortableColumns: ['id', 'name', 'color'],
      filterableColumns: {
        name: true,
        color: true,
        id: true,
      },
      defaultSortBy: [['id', 'ASC']],
      defaultLimit: 20,
    });
  }

  findAllNoPagination() {
    return this.projectRepository.find({
      order: {
        name: 'ASC',
      },
      select: ['name', 'color'],
    });
  }

  findOne(id: number) {
    return this.projectRepository.findOne({
      where: {
        id,
      },
    });
  }

  create(createProjectDto: CreateDto) {
    return this.projectRepository.save(createProjectDto);
  }

  update(id: number, updateProjectDto: UpdateDto) {
    return this.projectRepository.update(id, updateProjectDto);
  }

  remove(id: string) {
    return this.projectRepository.delete(id);
  }
}
