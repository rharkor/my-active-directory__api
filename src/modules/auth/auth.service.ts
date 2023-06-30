import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare as bcryptCompare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dtos/loginUser.dto';
import { CreateUserDto } from '../users/dtos/createUser.dto';
import User from '../users/entities/user.entity';

/*
 * The auth service is responsible for validating users only for the active directory app not for external apps
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async _findUser({ email, username }: { email?: string; username?: string }) {
    if (email) return this.usersService.findOne({ email }, true);
    if (username) return this.usersService.findOne({ username }, true);
    return null;
  }

  async _signToken(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...payload } = user;
    return this.jwtService.sign(payload);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this._findUser({ email });
    if (!user?.password) throw new Error('Invalid credentials');
    if (user && (await bcryptCompare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: LoginUserDto) {
    const foundUser = await this._findUser(user);
    if (!foundUser) throw new Error('Invalid credentials');
    if (!user.password || !foundUser.password)
      throw new Error('Cannot login withou password');
    if (!(await bcryptCompare(user.password, foundUser.password))) {
      throw new Error('Invalid credentials');
    }
    return {
      access_token: this._signToken(foundUser),
    };
  }

  async register(user: CreateUserDto) {
    const foundUser = await this._findUser(user);
    if (foundUser) throw new Error('User already exists');
    const hashedPassword = await hash(user.password, 10);
    user.password = hashedPassword;
    const newUser = await this.usersService.create(user);
    return {
      access_token: this._signToken(newUser),
    };
  }
}
