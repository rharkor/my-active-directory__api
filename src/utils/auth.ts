import { jwtConstants } from '@/modules/auth/constants';
import Token from '@/modules/auth/entities/token.entity';
import User from '@/modules/users/entities/user.entity';
import { PayloadType } from '@/types/auth';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import jwtDecode from 'jwt-decode';
import { Repository } from 'typeorm';

export const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
);

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...payload }: PayloadType & { password?: string } = user;
  return {
    accessToken: jwtService.sign(payload),
    refreshToken: jwtService.sign(payload, {
      expiresIn: jwtConstants.refreshIn,
    }),
  };
};

export const updateRefreshToken = async (
  user: User,
  refreshToken: string,
  userAgent: string,
  tokenRepository: Repository<Token>,
  ip: string,
) => {
  const tokenHash = await hash(refreshToken, 10);
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
