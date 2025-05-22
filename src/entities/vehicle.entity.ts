import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Transfer } from './transfer.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  plate: string;

  @Column()
  service: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Transfer, (transfer) => transfer.vehicle)
  transfers: Transfer[];
}
