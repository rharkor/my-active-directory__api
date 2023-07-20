import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Role from './entities/role.entity';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import User from '../users/entities/user.entity';
import { CreateDto } from './dtos/create.dto';
import { UpdateDto } from './dtos/update.dto';
import SysRole from './entities/sys-role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(SysRole)
    private sysRoleRepository: Repository<SysRole>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateDto) {
    try {
      return await this.roleRepository.save(createDto);
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

  async findAllSysNoPagination(): Promise<SysRole[]> {
    return this.sysRoleRepository.find({
      select: ['name', 'color'],
      order: {
        name: 'ASC',
      },
    });
  }

  async userHaveRole(
    id: number,
    roles: string[],
    isSysRole = false,
  ): Promise<Role[]> {
    const repo = isSysRole ? this.sysRoleRepository : this.roleRepository;
    //? Select all roles that have the user with the given id
    const qb = repo
      .createQueryBuilder('role')
      .leftJoin('role.users', 'user')
      .where('user.id = :id', { id })
      .andWhere('role.name IN (:...roles)', { roles });

    return qb.getMany();
  }

  async findByUser(
    id: number,
    query: PaginateQuery,
    isSysRole = false,
  ): Promise<Paginated<Role>> {
    //? Select all roles that have the user with the given id
    const repo = isSysRole ? this.sysRoleRepository : this.roleRepository;
    const qb = repo
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

  async ensureRoleExists(name: string, isSysRole = false): Promise<Role> {
    const repo = isSysRole ? this.sysRoleRepository : this.roleRepository;
    const role = await repo.findOne({
      where: {
        name,
      },
    });
    if (!role) throw new BadRequestException('Role not found');
    return role;
  }

  async addRoleToUser(
    user: User,
    role: Role,
    isSysRole = false,
  ): Promise<User> {
    if (isSysRole) {
      if (!user.sysroles) user.sysroles = [role];
      else user.sysroles.push(role);
      return this.userRepository.save(user);
    } else {
      if (!user.roles) user.roles = [role];
      else user.roles.push(role);
      return this.userRepository.save(user);
    }
  }

  async delete(id: number) {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });
    if (!role) throw new BadRequestException('Role not found');

    return this.roleRepository.delete(id);
  }
}
