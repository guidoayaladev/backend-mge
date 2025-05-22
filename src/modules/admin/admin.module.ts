import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, Role, Permission])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
