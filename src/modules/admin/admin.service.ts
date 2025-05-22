import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async getUsers() {
    return this.userRepo.find({
      relations: [
        'roles',
        'roles.permissions',
        'projects',
        'organizationalUnits',
      ],
    });
  }

  async getRoles() {
    return this.roleRepo.find({ relations: ['permissions'] });
  }

  async getPermissions() {
    return this.permissionRepo.find();
  }
}
