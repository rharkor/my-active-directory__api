import {
  Check,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Role from './role.entity';

@Entity()
@Check(`"email" IS NOT NULL OR "username" IS NOT NULL`)
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: true,
  })
  email?: string;

  @Column({
    unique: true,
    nullable: true,
  })
  username?: string;

  @Column({
    select: false,
    nullable: true,
  })
  password?: string;

  @Column({
    nullable: true,
  })
  firstName?: string;

  @Column({
    nullable: true,
  })
  lastName?: string;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  metadata?: Record<string, unknown>;

  @ManyToMany(() => Role, (role) => role.users, {
    eager: true,
  })
  @JoinTable()
  roles?: Role[];
}

export default User;
