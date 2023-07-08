import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiresIn: '15m',
  refreshIn: '30d',
};
