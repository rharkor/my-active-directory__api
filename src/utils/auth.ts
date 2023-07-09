import { jwtConstants } from '@/modules/auth/constants';
import User from '@/modules/users/entities/user.entity';
import { PayloadType } from '@/types/auth';
import { JwtService } from '@nestjs/jwt';

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
