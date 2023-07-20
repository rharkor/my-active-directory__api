import Project from '../../../modules/projects/entities/project.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class ServiceAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    select: false,
    unique: true,
  })
  token: string;

  @ManyToMany(() => Project, (project) => project.serviceAccounts, {
    eager: true,
  })
  @JoinTable()
  projects?: Project[];
}

export default ServiceAccount;
