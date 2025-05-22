import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';
import { Permissions } from 'src/shared/decorators/permission.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('manage_users')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Get('roles')
  getRoles() {
    return this.adminService.getRoles();
  }

  @Get('permissions')
  getPermissions() {
    return this.adminService.getPermissions();
  }
}
