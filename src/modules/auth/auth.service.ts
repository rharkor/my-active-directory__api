import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dtos/login-user.dto';
import { CreateDto } from '../users/dtos/create.dto';
import User from '../users/entities/user.entity';
import { CreateFirstDto } from '../users/dtos/create-first.dto';
import {
  PayloadType,
  RequestWithServiceAccount,
  RequestWithUser,
} from '@/types/auth';
import {
  bcryptCompare,
  checkPasswordSecurity,
  hash,
  signToken,
  updateRefreshToken,
} from '@/utils/auth';
import { defaultRoles, findHighestRole } from '@/utils/roles';
import { ServiceAccountService } from '../service-account/service-account.service';
import ServiceAccount from '../service-account/entities/service-account.entity';
import { RolesService } from '../roles/roles.service';
import { InjectRepository } from '@nestjs/typeorm';
import Token, { TokenUA } from './entities/token.entity';
import { Repository } from 'typeorm';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { UAParser } from 'ua-parser-js';

/*
 * The auth service is responsible for validating users only for the active directory app not for external apps
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private serviceAccountService: ServiceAccountService,
    private jwtService: JwtService,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async initialized() {
    return {
      initialized: !(await this.usersService.noSUUsers()),
    };
  }

  async validateUser(
    userInfo: {
      email?: string;
      username?: string;
    },
    pass: string,
  ): Promise<PayloadType | null> {
    const user = await this.usersService.findUser(userInfo, true);
    if (!user?.password) throw new ForbiddenException('Invalid credentials');
    if (user && (await bcryptCompare(pass, user.password))) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        password,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        refreshTokens,
        ...result
      }: PayloadType & { password?: string; refreshTokens?: Token[] } = user;
      return result;
    }
    return null;
  }

  async validateApi(apiKey: string): Promise<ServiceAccount> {
    const api = await this.serviceAccountService.findApiKey(apiKey);
    if (!api) throw new ForbiddenException('Invalid credentials');
    return api;
  }

  async login(user: LoginUserDto, userAgent: string, req: Request) {
    const foundUser = await this.usersService.findUser(user, true);
    if (!foundUser) throw new ForbiddenException('Invalid credentials');
    if (!user.password || !foundUser.password)
      throw new ForbiddenException('Cannot login without password');
    if (!(await bcryptCompare(user.password, foundUser.password))) {
      throw new ForbiddenException('Invalid credentials');
    }

    const tokens = signToken(foundUser, this.jwtService);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await updateRefreshToken(
      foundUser,
      tokens.refreshToken,
      userAgent,
      this.tokenRepository,
      ip?.toString() ?? '',
    );
    return signToken(foundUser, this.jwtService);
  }

  //? Register without auth is allowed only if there are no users in the database
  async registerInit(user: CreateFirstDto, userAgent: string, req: Request) {
    if (!(await this.usersService.noSUUsers()))
      throw new ForbiddenException('Users already exist');
    const passwordSecurity = checkPasswordSecurity(user.password);
    if (passwordSecurity.valid !== true)
      throw new BadRequestException(passwordSecurity.error);

    //? Verify that the roles are valid
    const superAdminRole = await this.rolesService.ensureRoleExists(
      'super-admin',
    );

    //* Hash the password
    const hashedPassword = await hash(user.password, 10);
    user.password = hashedPassword;
    const newUser = await this.usersService.create({
      email: user.email,
      username: user.username,
      password: user.password,
    });
    //* Add super admin role
    await this.rolesService.addRoleToUser(newUser, superAdminRole);

    const tokens = signToken(newUser, this.jwtService);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await updateRefreshToken(
      newUser,
      tokens.refreshToken,
      userAgent,
      this.tokenRepository,
      ip?.toString() ?? '',
    );
    return tokens;
  }

  async register(
    user: CreateDto,
    req: RequestWithUser | RequestWithServiceAccount,
  ) {
    const foundUser = await this.usersService.findUser(user, true);
    if (foundUser) throw new BadRequestException('User already exists');

    const userAgent = req.headers['user-agent'] || '';

    let highestRole: string;
    if ('user' in req && req.user) {
      if (!('roles' in req.user))
        throw new ForbiddenException('Roles not found');
      highestRole = findHighestRole(req.user.roles);
    } else {
      highestRole = 'service-account';
    }
    if (user.password) {
      const passwordSecurity = checkPasswordSecurity(user.password);
      if (passwordSecurity.valid !== true)
        throw new BadRequestException(passwordSecurity.error);
      const hashedPassword = await hash(user.password, 10);
      user.password = hashedPassword;
    }

    //* If the user is not admin, super-admin or service-account, throw an error
    if (
      highestRole !== 'admin' &&
      highestRole !== 'super-admin' &&
      highestRole !== 'service-account'
    )
      throw new ForbiddenException('You are not allowed to create users');

    //* If the user is service-account, do not allow any roles of the list defaultRoles to be added
    if (highestRole === 'service-account' && user.roles) {
      const roles = user.roles.filter((role) =>
        defaultRoles.some((r) => r.name === role.name),
      );
      if (roles.length > 0)
        throw new ForbiddenException(
          `You are not allowed to add the following roles: ${roles.join(', ')}`,
        );
    }

    //* If the user is admin do not allow the role super-admin and admin to be added
    if (highestRole === 'admin' && user.roles) {
      const roles = user.roles.filter(
        (role) => role.name === 'super-admin' || role.name === 'admin',
      );
      if (roles.length > 0)
        throw new ForbiddenException(
          `You are not allowed to add the following roles: ${roles.join(', ')}`,
        );
    }

    const newUser = await this.usersService.create(user);
    const tokens = signToken(newUser, this.jwtService);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    updateRefreshToken(
      newUser,
      tokens.refreshToken,
      userAgent,
      this.tokenRepository,
      ip?.toString() ?? '',
    );
    return tokens;
  }

  async refreshTokens(req: Request) {
    const refreshToken: string | string[] | undefined =
      req.headers?.['x-refresh'];
    const userAgent: string | string[] | undefined =
      req.headers?.['user-agent'];
    const accessToken: string | undefined = req.headers?.['authorization']
      ?.toString()
      .split(' ')[1];
    if (!refreshToken || !(typeof refreshToken === 'string') || !accessToken) {
      Logger.debug('No refresh token or access token');
      throw new ForbiddenException('Invalid credentials');
    }

    //* Verify the tokens
    let aUser: User;
    let rUser: User;
    //? Verify the access token
    try {
      aUser = this.jwtService.verify(accessToken, {
        secret: jwtConstants.secret,
        ignoreExpiration: true,
      }) as User;
    } catch (err) {
      Logger.debug('Access token invalid');
      throw new ForbiddenException('Invalid credentials');
    }

    //? Verify the refresh token
    try {
      rUser = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.secret,
      }) as User;
    } catch (err) {
      Logger.debug('Refresh token invalid');
      throw new ForbiddenException('Invalid credentials');
    }

    if (aUser.id !== rUser.id) {
      Logger.debug('User ids do not match in tokens');
      throw new ForbiddenException('Invalid credentials');
    }

    //? Find the user in the database
    const user = await this.usersService.findUser(rUser, false, {
      relations: {
        refreshTokens: true,
      },
    });
    if (!user) {
      Logger.debug('User not found in database');
      throw new ForbiddenException('Invalid credentials');
    }
    if (!user.refreshTokens || user.refreshTokens.length === 0) {
      Logger.debug('Token not found in database');
      throw new UnauthorizedException('Invalid credentials');
    }
    //? Find the refresh token in the database
    let foundToken: Token | undefined;
    for (const token of user.refreshTokens) {
      if (await bcryptCompare(refreshToken, token.refreshToken)) {
        foundToken = token;
        break;
      }
    }

    if (!foundToken) {
      Logger.debug('Refresh token does not match');
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = signToken(user, this.jwtService);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    //? Do not pass the refresh token to not refresh it
    await updateRefreshToken(
      user,
      undefined,
      userAgent ?? '',
      this.tokenRepository,
      ip?.toString() ?? '',
    );
    return {
      accessToken: tokens.accessToken,
    };
  }

  async findAllTokens(query: PaginateQuery): Promise<Paginated<TokenUA>> {
    const res = await paginate<Token>(query, this.tokenRepository, {
      sortableColumns: ['id'],
      filterableColumns: {
        id: true,
      },
      defaultLimit: 5,
    });
    const data: TokenUA[] = res.data.map((token) => {
      const ua = new UAParser(token.userAgent);
      return {
        ...ua.getResult(),
        //? Add others fields
        ...token,
      };
    });

    const resForce = res as unknown as Paginated<TokenUA>;

    return {
      ...resForce,
      data,
    };
  }

  removeToken(id: number) {
    return this.tokenRepository.delete(id);
  }
}
