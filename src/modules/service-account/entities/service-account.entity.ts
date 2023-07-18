import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}

export default ServiceAccount;
