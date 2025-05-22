import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { Repository, In } from 'typeorm';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { AuthenticatedUser } from 'src/shared/types/authenticated-user.interface';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async findAll(user: AuthenticatedUser) {
    return this.projectRepo.find({
      where: {
        id: In(user.projectIds),
      },
      relations: ['units'],
    });
  }

  async create(dto: CreateProjectDto, user: AuthenticatedUser) {
    const project = this.projectRepo.create(dto);
    return this.projectRepo.save(project);
  }

  async update(id: string, dto: UpdateProjectDto, user: AuthenticatedUser) {
    const project = await this.projectRepo.findOneBy({ id });
    if (!project) throw new NotFoundException('Proyecto no encontrado');

    if (!user.projectIds.includes(project.id)) {
      throw new ForbiddenException('No tienes acceso a este proyecto');
    }

    Object.assign(project, dto);
    return this.projectRepo.save(project);
  }

  async remove(id: string, user: AuthenticatedUser) {
    const project = await this.projectRepo.findOneBy({ id });
    if (!project) throw new NotFoundException('Proyecto no encontrado');

    if (!user.projectIds.includes(project.id)) {
      throw new ForbiddenException('No tienes acceso a este proyecto');
    }

    return this.projectRepo.remove(project);
  }
}
