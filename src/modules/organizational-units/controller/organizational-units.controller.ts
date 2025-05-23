import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OrganizationalUnitService } from '../service/organizational-units.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';
import { Permissions } from 'src/shared/decorators/permission.decorator';
import { CreateOrganizationalUnitDto } from '../dto/create-organizational-unit.dto';
import { UpdateOrganizationalUnitDto } from '../dto/update-organizational-unit.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { AuthenticatedUser } from 'src/shared/types/authenticated-user.interface';

@Controller('organizational-units')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrganizationalUnitController {
  constructor(private readonly service: OrganizationalUnitService) {}

  @Get()
  @Permissions('view_units')
  findAll(@User() user: AuthenticatedUser) {
    return this.service.findAll(user);
  }

  @Post()
  @Permissions('create_units')
  create(
    @Body() dto: CreateOrganizationalUnitDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.service.create(dto, user);
  }

  @Put(':id')
  @Permissions('edit_units')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationalUnitDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  @Permissions('delete_units')
  remove(@Param('id') id: string, @User() user: AuthenticatedUser) {
    return this.service.remove(id, user);
  }

  @Post(':unitId/users/:userId')
  @Permissions('create_units')
  addUserToUnit(
    @Param('unitId') unitId: string,
    @Param('userId') userId: string,
    @User() currentUser: AuthenticatedUser,
  ) {
    return this.service.linkUserToUnit(unitId, userId, currentUser);
  }
}
