import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import User from '../../users/entities/user.entity';

@Entity()
class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  displayName: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column({
    default: true,
  })
  deletable: boolean;

  @Column({
    nullable: true,
  })
  color?: string;

  @ManyToMany(() => User, (user) => user.roles)
  users?: User[];
}

export default Role;
