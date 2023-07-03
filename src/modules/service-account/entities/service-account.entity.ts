import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class ServiceAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  token: string;
}

export default ServiceAccount;
