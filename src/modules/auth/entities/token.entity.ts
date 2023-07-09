import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import User from '../../users/entities/user.entity';
import { IResult } from 'ua-parser-js';

@Entity()
@Unique('userAgent', ['userAgent', 'user'])
class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  refreshToken: string;

  @Column({
    default: '',
  })
  userAgent: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}

export default Token;

export type TokenUA = IResult;
