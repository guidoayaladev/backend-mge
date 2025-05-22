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
import { VehicleService } from '../services/vehicle.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';
import { Permissions } from 'src/shared/decorators/permission.decorator';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../dtos/update-vehicle.dto';
import { User } from 'src/shared/decorators/user.decorator'; // 👈

@Controller('vehicles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VehicleController {
  constructor(private readonly service: VehicleService) {}

  @Get()
  @Permissions('view_vehicles')
  findAll(@User() user: any) {
    return this.service.findAll(user);
  }

  @Post()
  @Permissions('create_vehicles')
  create(@Body() dto: CreateVehicleDto, @User() user: any) {
    return this.service.create(dto, user);
  }

  @Put(':id')
  @Permissions('edit_vehicles')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
    @User() user: any,
  ) {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  @Permissions('delete_vehicles')
  remove(@Param('id') id: string, @User() user: any) {
    return this.service.remove(id, user);
  }
}
