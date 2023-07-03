import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Role from './entities/role.entity';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import User from '../users/entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAllRoles(query: PaginateQuery): Promise<Paginated<Role>> {
    return paginate<Role>(query, this.roleRepository, {
      sortableColumns: ['name'],
      filterableColumns: {
        name: true,
        displayName: true,
        description: true,
        id: true,
        deletable: true,
      },
      defaultLimit: 100,
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

  async findRoles(id: number, query: PaginateQuery): Promise<Paginated<Role>> {
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

  async addRole(user: User, role: string): Promise<User> {
    const roleObject = await this.roleRepository.findOne({
      where: {
        name: role,
      },
    });
    if (!roleObject) throw new BadRequestException('Role not found');
    if (!user.roles) user.roles = [roleObject];
    else user.roles.push(roleObject);
    return this.userRepository.save(user);
  }
}
