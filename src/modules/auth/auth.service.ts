import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare as bcryptCompare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './login/loginUser.dto';
import { CreateUserDto } from '../users/dtos/createUser.dto';
import User from '../users/entities/user.entity';
import { CreateFirstUserDto } from '../users/dtos/createFirstUser.dto';
import {
  PayloadType,
  RequestWithServiceAccount,
  RequestWithUser,
} from '@/types/auth';
import { checkPasswordSecurity } from '@/utils/auth';
import { defaultRoles, findHighestRole } from '@/utils/roles';
import { ServiceAccountService } from '../service-account/service-account.service';
import ServiceAccount from '../service-account/entities/service-account.entity';
import { RolesService } from '../roles/roles.service';
import { Roles } from '@/meta/roles.meta';

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
  ) {}

  _signToken(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...payload }: PayloadType & { password?: string } = user;
    return this.jwtService.sign(payload);
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result }: PayloadType & { password?: string } = user;
      return result;
    }
    return null;
  }

  async validateApi(apiKey: string): Promise<ServiceAccount> {
    const api = await this.serviceAccountService.findApiKey(apiKey);
    if (!api) throw new ForbiddenException('Invalid credentials');
    return api;
  }

  async login(user: LoginUserDto) {
    const foundUser = await this.usersService.findUser(user, true);
    if (!foundUser) throw new ForbiddenException('Invalid credentials');
    if (!user.password || !foundUser.password)
      throw new ForbiddenException('Cannot login withou password');
    if (!(await bcryptCompare(user.password, foundUser.password))) {
      throw new ForbiddenException('Invalid credentials');
    }
    return {
      access_token: this._signToken(foundUser),
    };
  }

  //? Register without auth is allowed only if there are no users in the database
  async registerInit(user: CreateFirstUserDto) {
    if (!(await this.usersService.noUsers()))
      throw new ForbiddenException('Users already exist');
    const passwordSecurity = checkPasswordSecurity(user.password);
    if (passwordSecurity.valid !== true)
      throw new BadRequestException(passwordSecurity.error);
    const hashedPassword = await hash(user.password, 10);
    user.password = hashedPassword;
    const newUser = await this.usersService.create({
      email: user.email,
      username: user.username,
      password: user.password,
    });
    //* Add super admin role
    await this.rolesService.addRole(newUser, 'super-admin');

    return {
      access_token: this._signToken(newUser),
    };
  }

  @Roles('admin', 'super-admin', 'service-account')
  async register(
    user: CreateUserDto,
    req: RequestWithUser | RequestWithServiceAccount,
  ) {
    const foundUser = await this.usersService.findUser(user, true);
    if (foundUser) throw new BadRequestException('User already exists');

    let highestRole: string;
    if ('user' in req) {
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
    return {
      access_token: this._signToken(newUser),
    };
  }
}
