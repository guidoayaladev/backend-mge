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
import { ProjectService } from '../service/projects.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';
import { Permissions } from 'src/shared/decorators/permission.decorator';
import { User } from 'src/shared/decorators/user.decorator';
import { AuthenticatedUser } from 'src/shared/types/authenticated-user.interface';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Get()
  @Permissions('view_projects')
  findAll(@User() user: AuthenticatedUser) {
    return this.service.findAll(user);
  }

  @Post()
  @Permissions('create_projects')
  create(@Body() dto: CreateProjectDto, @User() user: AuthenticatedUser) {
    return this.service.create(dto, user);
  }

  @Put(':id')
  @Permissions('edit_projects')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  @Permissions('delete_projects')
  remove(@Param('id') id: string, @User() user: AuthenticatedUser) {
    return this.service.remove(id, user);
  }

  @Post(':projectId/users/:userId')
  addUserToProject(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @User() currentUser: AuthenticatedUser,
  ) {
    return this.service.linkUserToProject(userId, projectId, currentUser);
  }
}
