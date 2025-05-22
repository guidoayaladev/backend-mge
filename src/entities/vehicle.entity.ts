import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Transfer } from './transfer.entity';
import { Project } from './project.entity';

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

  @ManyToOne(() => Project, { eager: true })
  project: Project;
}
