import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Role from './role.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @ManyToMany(() => Role, undefined, {
    eager: true,
  })
  @JoinTable()
  roles: Role[];
}

export default User;
