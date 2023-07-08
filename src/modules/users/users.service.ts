import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import User from './entities/user.entity';
import { CreateDto } from './dtos/create.dto';
import { UpdateDto } from './dtos/update.dto';
import { findHighestRole } from '@/utils/roles';
import { RequestWithServiceAccount, RequestWithUser } from '@/types/auth';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { hash } from 'bcrypt';
import Role from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findOne(
    where:
      | FindOptionsWhere<User>
      | FindOptionsWhere<User>[]
      | number
      | undefined,
    withPassword = false,
    options?: FindOneOptions<User>,
  ): Promise<User | null> {
    let value: User | null;
    if (withPassword)
      value = await this.userRepository.findOne({
        where: typeof where === 'number' ? { id: where } : where,
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
        ...options,
      });
    else
      value = await this.userRepository.findOne({
        where: typeof where === 'number' ? { id: where } : where,
        ...options,
      });

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
    options?: FindOneOptions<User>,
  ) {
    if (email) return this.findOne({ email }, withPassword, options);
    if (username) return this.findOne({ username }, withPassword, options);
    return null;
  }

  async noUsers(): Promise<boolean> {
    return (await this.userRepository.createQueryBuilder().getCount()) === 0;
  }

  async create(user: CreateDto): Promise<User> {
    //* Check if all roles exist
    if (user.roles) {
      const roles = await this.roleRepository.findBy({
        name: In(user.roles),
      });
      if (roles.length !== user.roles.length)
        throw new BadRequestException('Invalid roles');

      //? Set roles
      user.roles = roles;
    }

    const userObject = this.userRepository.create(user);
    return this.userRepository.save(userObject);
  }

  async update(
    id: number,
    user: UpdateDto,
    req: RequestWithUser | RequestWithServiceAccount,
  ): Promise<User> {
    let highestRole: string;
    if ('user' in req && req.user && 'roles' in req.user)
      highestRole = findHighestRole(req.user.roles);
    else highestRole = 'service-account';

    if (highestRole === 'user') {
      if (!('user' in req) || !req.user || !('id' in req.user))
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

    //? Encrypt password if it is provided
    if (user.password) user.password = await hash(user.password, 10);

    return this.userRepository.save({ id: userObject.id, ...user });
  }

  async remove(
    id: number,
    req: RequestWithUser | RequestWithServiceAccount,
  ): Promise<DeleteResult> {
    let highestRole: string;
    if ('user' in req && req.user && 'roles' in req.user)
      highestRole = findHighestRole(req.user.roles);
    else highestRole = 'service-account';

    if (highestRole === 'user') {
      if (!('user' in req) || !req.user || !('id' in req.user))
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

    return this.userRepository.delete(id);
  }
}
