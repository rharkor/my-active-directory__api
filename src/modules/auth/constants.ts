import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiresIn: '15m', // 15 minutes
  refreshIn: '30d', // 30 days
};
