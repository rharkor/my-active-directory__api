import ServiceAccount from '../../../modules/service-account/entities/service-account.entity';
import User from '../../../modules/users/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  color?: string;

  @ManyToMany(() => User, (user) => user.projects)
  users?: User[];

  @ManyToMany(() => ServiceAccount, (serviceAccount) => serviceAccount.projects)
  serviceAccounts?: ServiceAccount[];
}

export default Project;
