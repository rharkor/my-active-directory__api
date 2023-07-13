import {
  Check,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  VirtualColumn,
} from 'typeorm';
import Role from '../../roles/entities/role.entity';
import Token from '../../auth/entities/token.entity';

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

  @OneToMany(() => Token, (token) => token.user)
  refreshTokens?: Token[];

  @VirtualColumn({
    type: 'integer',
    query: (alias) => {
      return `SELECT COUNT(*) FROM user_roles_role r WHERE r."userId" = ${alias}.id`;
    },
  })
  activeRoles?: number;
}

export default User;
