import { jwtConstants } from '@/modules/auth/constants';
import Token from '@/modules/auth/entities/token.entity';
import User from '@/modules/users/entities/user.entity';
import {
  PayloadType,
  RequestWithServiceAccount,
  RequestWithUser,
} from '@/types/auth';
import { JwtService } from '@nestjs/jwt';
import { hash as bhash, compare } from 'bcrypt';
import jwtDecode from 'jwt-decode';
import { Repository } from 'typeorm';
import * as crypto from 'crypto-js';

export const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
);

export const slugRegex = new RegExp(/^[a-z0-9]+(?:-|[a-z0-9])*$/);

export const checkPasswordSecurity = (password: string) => {
  const valid = passwordRegex.test(password);
  if (valid)
    return {
      valid,
    };
  return {
    valid,
    error:
      'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character',
  };
};

export const signToken = (user: User, jwtService: JwtService) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    password,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refreshTokens,
    ...payload
  }: PayloadType & { password?: string; refreshTokens?: Token[] } = user;

  return {
    accessToken: jwtService.sign(payload),
    refreshToken: jwtService.sign(payload, {
      expiresIn: jwtConstants.refreshIn,
    }),
  };
};

export const updateRefreshToken = async (
  user: User,
  refreshToken: string | undefined,
  userAgent: string,
  tokenRepository: Repository<Token>,
  ip: string,
) => {
  const tokenHash = refreshToken ? await hash(refreshToken, 10) : undefined;
  const res = await tokenRepository.update(
    {
      user: {
        id: user.id,
      },
      userAgent,
    },
    {
      refreshToken: tokenHash,
      lastUsed: new Date(),
    },
  );
  if (res.affected === 0) {
    if (!refreshToken) throw new Error('No refresh token provided');
    const decoded = jwtDecode(refreshToken) as {
      exp: number;
    };
    await tokenRepository.save({
      user,
      refreshToken: tokenHash,
      userAgent,
      createdAt: new Date(),
      lastUsed: new Date(),
      expiresAt: new Date(decoded.exp * 1000),
      createdByIp: ip,
    });
  }
};

const PASSWORD_HASHER = process.env.PASSWORD_HASHER;
if (!PASSWORD_HASHER) throw new Error('PASSWORD_HASHER not set in .env file');

export const hash = async (value: string, saltOrRounds: string | number) => {
  const preHashed = crypto.HmacSHA256(value, PASSWORD_HASHER).toString();
  return await bhash(preHashed, saltOrRounds);
};

export const bcryptCompare = async (value: string, hash: string) => {
  const preHashed = crypto.HmacSHA256(value, PASSWORD_HASHER).toString();
  return compare(preHashed, hash);
};

export const userIsNotItself = (
  req: RequestWithServiceAccount | RequestWithUser,
  id: number,
) => {
  return (
    !('user' in req) || !req.user || !('id' in req.user) || req.user.id !== id
  );
};
