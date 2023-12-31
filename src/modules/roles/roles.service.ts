import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Role from './entities/role.entity';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import User from '../users/entities/user.entity';
import { CreateDto } from './dtos/create.dto';
import { UpdateDto } from './dtos/update.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateDto) {
    try {
      return await this.roleRepository.save({
        ...createDto,
        deletable: true,
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Role already exists');
      }
      throw error;
    }
  }

  async update(id: number, updateDto: UpdateDto) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });
    if (!role) {
      throw new BadRequestException('Role not found');
    }
    return await this.roleRepository.save({
      ...role,
      ...updateDto,
    });
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Role>> {
    return paginate<Role>(query, this.roleRepository, {
      sortableColumns: ['id', 'name', 'displayName', 'description'],
      filterableColumns: {
        name: true,
        displayName: true,
        description: true,
        id: true,
        deletable: true,
      },
      defaultSortBy: [['id', 'ASC']],
      defaultLimit: 20,
    });
  }

  async findAllNoPagination(): Promise<Role[]> {
    return this.roleRepository.find({
      select: ['name', 'color'],
      order: {
        name: 'ASC',
      },
    });
  }

  async userHaveRole(id: number, roles: string[]): Promise<Role[]> {
    //? Select all roles that have the user with the given id
    const qb = this.roleRepository
      .createQueryBuilder('role')
      .leftJoin('role.users', 'user')
      .where('user.id = :id', { id })
      .andWhere('role.name IN (:...roles)', { roles });

    return qb.getMany();
  }

  async findByUser(id: number, query: PaginateQuery): Promise<Paginated<Role>> {
    //? Select all roles that have the user with the given id
    const qb = this.roleRepository
      .createQueryBuilder('role')
      .leftJoin('role.users', 'user')
      .where('user.id = :id', { id });

    return paginate<Role>(query, qb, {
      sortableColumns: ['name'],
      filterableColumns: {
        name: true,
        displayName: true,
        description: true,
        id: true,
        deletable: true,
      },
    });
  }

  findOne(id: number): Promise<Role> {
    return this.roleRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async ensureRoleExists(name: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: {
        name,
      },
    });
    if (!role) throw new BadRequestException('Role not found');
    return role;
  }

  async addRoleToUser(user: User, role: Role): Promise<User> {
    if (!user.roles) user.roles = [role];
    else user.roles.push(role);
    return this.userRepository.save(user);
  }

  async delete(id: number) {
    //* Ensure that the role is deletable
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
      select: ['deletable'],
    });
    if (!role) throw new BadRequestException('Role not found');
    if (!role.deletable) throw new BadRequestException('Role not deletable');

    return this.roleRepository.delete(id);
  }
}
