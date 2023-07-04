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
    select: false,
  })
  deletable: boolean;

  @ManyToMany(() => User, (user) => user.roles)
  users?: User[];
}

export default Role;