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
import { TransferService } from '../service/transfer.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { Permissions } from 'src/shared/decorators/permission.decorator';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';

@Controller('transfers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TransferController {
  constructor(private readonly transfersService: TransferService) {}

  @Get()
  @Permissions('view_transfers')
  async findAll(@User() user: any) {
    return this.transfersService.findAll(user);
  }

  @Post()
  @Permissions('create_transfers')
  async create(@Body() body: any, @User() user: any) {
    return this.transfersService.create(body, user);
  }

  @Put(':id')
  @Permissions('edit_transfers')
  async update(@Param('id') id: string, @Body() body: any, @User() user: any) {
    return this.transfersService.update(id, body, user);
  }

  @Delete(':id')
  @Permissions('delete_transfers')
  async remove(@Param('id') id: string, @User() user: any) {
    return this.transfersService.remove(id, user);
  }
}
