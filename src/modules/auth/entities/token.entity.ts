import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../../users/entities/user.entity';

@Entity()
class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  refreshToken: string;

  @OneToOne(() => User, (user) => user.refreshToken)
  @JoinColumn()
  user: User;
}

export default Token;
