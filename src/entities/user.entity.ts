import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Project } from './project.entity';
import { OrganizationalUnit } from './organizational-unit.entity';
import { Role } from './role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => Project, (project) => project.users)
  @JoinTable()
  projects: Project[];

  @ManyToMany(() => OrganizationalUnit, (unit) => unit.users)
  @JoinTable()
  organizationalUnits: OrganizationalUnit[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];
}
