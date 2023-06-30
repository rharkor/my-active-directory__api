import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}

export default Role;
