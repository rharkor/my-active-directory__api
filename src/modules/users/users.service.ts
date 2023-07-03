import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import User from './entities/user.entity';
import { CreateUserDto } from './dtos/createUser.dto';
import Role from './entities/role.entity';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { findHighestRole } from '@/utils/roles';
import { RequestWithServiceAccount, RequestWithUser } from '@/types/auth';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findOne(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[] | undefined,
    withPassword = false,
  ): Promise<User | null> {
    let value: User | null;
    if (withPassword)
      value = await this.userRepository.findOne({
        where,
        select: [
          'id',
          'email',
          'username',
          'password',
          'firstName',
          'lastName',
          'metadata',
          'roles',
        ],
      });
    value = await this.userRepository.findOne({ where });

    //? Lmit the number of roles to 100
    if (value && value.roles && (value.roles.length ?? 0) > 100)
      value.roles = value.roles.slice(0, 100);

    return value;
  }

  async findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate<User>(query, this.userRepository, {
      sortableColumns: ['id', 'email', 'username', 'firstName', 'lastName'],
      filterableColumns: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  async findUser(
    { email, username }: { email?: string; username?: string },
    withPassword = false,
  ) {
    if (email) return this.findOne({ email }, withPassword);
    if (username) return this.findOne({ username }, withPassword);
    return null;
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

  async noUsers(): Promise<boolean> {
    return (await this.userRepository.createQueryBuilder().getCount()) === 0;
  }

  async create(user: CreateUserDto): Promise<User> {
    const userObject = this.userRepository.create(user);
    return this.userRepository.save(userObject);
  }

  async update(
    id: number,
    user: UpdateUserDto,
    req: RequestWithUser | RequestWithServiceAccount,
  ): Promise<User> {
    let highestRole: string;
    if ('user' in req) highestRole = findHighestRole(req.user.roles);
    else highestRole = 'service-account';

    if (highestRole === 'user') {
      if (!('user' in req))
        throw new BadRequestException('You cannot update other users');
      if (req.user.id !== id)
        throw new BadRequestException('You cannot update other users');
    }

    const userObject = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!userObject) throw new BadRequestException('User not found');

    // Admin cannot update other admins or super-admins
    const userHighestRole = findHighestRole(userObject.roles);
    if (
      (userHighestRole === 'admin' || userHighestRole === 'super-admin') &&
      highestRole !== 'super-admin'
    )
      throw new BadRequestException('You cannot update other admins');
    return this.userRepository.save({ ...userObject, ...user });
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

  async delete(
    id: number,
    req: RequestWithUser | RequestWithServiceAccount,
  ): Promise<void> {
    let highestRole: string;
    if ('user' in req) highestRole = findHighestRole(req.user.roles);
    else highestRole = 'service-account';

    if (highestRole === 'user') {
      if (!('user' in req))
        throw new BadRequestException('You cannot delete other users');
      if (req.user.id !== id)
        throw new BadRequestException('You cannot delete other users');
    }

    const userToDelete = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!userToDelete) throw new BadRequestException('User not found');

    // Admin cannot delete other admins or super-admins
    const userHighestRole = findHighestRole(userToDelete.roles);
    if (
      (userHighestRole === 'admin' || userHighestRole === 'super-admin') &&
      highestRole !== 'super-admin'
    )
      throw new BadRequestException('You cannot delete other admins');

    await this.userRepository.delete(id);
  }
}
