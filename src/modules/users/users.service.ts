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
import Role from '../roles/entities/role.entity';
import {
  bcryptCompare,
  hash,
  signToken,
  updateRefreshToken,
} from '@/utils/auth';
import { JwtService } from '@nestjs/jwt';
import { UpdateResponseDto } from './dtos/update-response.dto';
import { UpdatePasswordResponseDto } from './dtos/update-password-response.dto';
import Token from '../auth/entities/token.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private jwtService: JwtService,
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
  ): Promise<UpdateResponseDto> {
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

    const userAgent: string | string[] | undefined =
      req.headers?.['user-agent'];

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

    const res = (await this.userRepository.save({
      id: userObject.id,
      ...user,
    })) as User & { tokens?: { accessToken: string; refreshToken: string } };

    const newUser = {
      ...userObject,
    };
    if ('email' in user) newUser.email = user.email;
    if ('username' in user) newUser.username = user.username;

    //? Refresh tokens if username, email with the new username or email
    if (user.username || user.email) {
      const tokens = signToken(newUser, this.jwtService);
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      updateRefreshToken(
        newUser,
        tokens.refreshToken,
        userAgent ?? '',
        this.tokenRepository,
        ip?.toString() ?? '',
      );
      res.tokens = tokens;
    }

    return res;
  }

  async updatePassword(
    id: number,
    oldPassword: string,
    password: string,
    req: RequestWithUser | RequestWithServiceAccount,
  ): Promise<UpdatePasswordResponseDto> {
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

    const userAgent: string | string[] | undefined =
      req.headers?.['user-agent'];

    const userObject = await this.findOne(
      {
        id,
      },
      true,
    );
    if (!userObject) throw new BadRequestException('User not found');

    // Admin cannot update other admins or super-admins
    const userHighestRole = findHighestRole(userObject.roles);
    if (
      (userHighestRole === 'admin' || userHighestRole === 'super-admin') &&
      highestRole !== 'super-admin'
    )
      throw new BadRequestException('You cannot update other admins');

    if (!userObject.password) {
      throw new BadRequestException('User does not have a password');
    }

    if (!(await bcryptCompare(oldPassword, userObject.password)))
      throw new BadRequestException('Invalid password');

    const hashedPassword = await hash(password, 10);
    const res = (await this.userRepository.save({
      id: userObject.id,
      password: hashedPassword,
    })) as User & { tokens: { accessToken: string; refreshToken: string } };

    const newUser = {
      ...userObject,
      password: hashedPassword,
    };

    //? Refresh tokens
    const tokens = signToken(newUser, this.jwtService);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    updateRefreshToken(
      newUser,
      tokens.refreshToken,
      userAgent ?? '',
      this.tokenRepository,
      ip?.toString() ?? '',
    );
    res.tokens = tokens;

    return res;
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
