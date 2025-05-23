import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/entities/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { AuthenticatedUser } from 'src/shared/types/authenticated-user.interface';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findAll(user: AuthenticatedUser) {
    if (!user.projectIds.length) return [];
    return this.projectRepo.findByIds(user.projectIds);
  }

  async create(dto: CreateProjectDto, user: AuthenticatedUser) {
    const existing = await this.projectRepo.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new BadRequestException('Ya existe un proyecto con ese nombre');
    }

    const userDb = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['projects'],
    });

    if (!userDb) throw new NotFoundException('Usuario no encontrado');

    const project = this.projectRepo.create({
      name: dto.name,
      description: dto.description,
    });

    const savedProject = await this.projectRepo.save(project);
    userDb.projects.push(savedProject);
    await this.userRepo.save(userDb);

    return savedProject;
  }

  async update(id: string, dto: UpdateProjectDto, user: AuthenticatedUser) {
    if (!user.projectIds.includes(id)) {
      throw new ForbiddenException('No tienes acceso a este proyecto');
    }

    const project = await this.projectRepo.preload({
      id,
      ...dto,
    });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return this.projectRepo.save(project);
  }

  async remove(id: string, user: AuthenticatedUser) {
    if (!user.projectIds.includes(id)) {
      throw new ForbiddenException('No tienes acceso a este proyecto');
    }

    const project = await this.projectRepo.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return this.projectRepo.remove(project);
  }

  async linkUserToProject(
    projectId: string,
    targetUserId: string,
    currentUser: AuthenticatedUser,
  ) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }
    if (
      !currentUser.projectIds.includes(projectId) ||
      !currentUser.permissions.includes('create_projects')
    ) {
      throw new ForbiddenException(
        'No tienes permisos para asignar usuarios a este proyecto',
      );
    }

    const userToAdd = await this.userRepo.findOne({
      where: { id: targetUserId },
      relations: ['projects'],
    });

    if (!userToAdd) {
      throw new NotFoundException('Usuario destino no encontrado');
    }

    const alreadyAssigned = userToAdd.projects.some((p) => p.id === projectId);

    if (alreadyAssigned) {
      throw new BadRequestException(
        'El usuario ya está asignado a este proyecto',
      );
    }

    userToAdd.projects.push(project);
    await this.userRepo.save(userToAdd);

    return { message: 'Usuario asignado al proyecto correctamente' };
  }
}
