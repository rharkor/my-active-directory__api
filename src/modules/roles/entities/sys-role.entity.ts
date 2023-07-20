import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import User from '../../users/entities/user.entity';

@Entity()
class SysRole {
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
    nullable: true,
  })
  color?: string;

  @ManyToMany(() => User, (user) => user.sysroles)
  users?: User[];
}

export default SysRole;
