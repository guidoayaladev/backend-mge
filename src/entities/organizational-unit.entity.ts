import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { UserEntity } from './user.entity';

@Entity('organizational_units')
export class OrganizationalUnit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Project, (project) => project.units, { nullable: false })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToMany(() => UserEntity, (user) => user.organizationalUnits)
  users: UserEntity[];
}
