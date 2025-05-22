import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { UserEntity } from './user.entity';
import { Project } from './project.entity';
import { OrganizationalUnit } from './organizational-unit.entity';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  type: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.transfers, { nullable: false })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'transmitter_id' })
  transmitter: UserEntity;

  @ManyToOne(() => Project, { nullable: false })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => OrganizationalUnit, { nullable: false })
  @JoinColumn({ name: 'organizational_unit_id' })
  organizationalUnit: OrganizationalUnit;
}
