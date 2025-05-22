import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { OrganizationalUnit } from './organizational-unit.entity';
import { UserEntity } from './user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => OrganizationalUnit, (unit) => unit.project)
  units: OrganizationalUnit[];

  @ManyToMany(() => UserEntity, (user) => user.projects)
  users: UserEntity[];
}
