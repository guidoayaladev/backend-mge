import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from 'src/entities/vehicle.entity';
import { Repository, In } from 'typeorm';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../dtos/update-vehicle.dto';
import { AuthenticatedUser } from '../../../shared/types/authenticated-user.interface';
import { Project } from 'src/entities/project.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly repo: Repository<Vehicle>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async findAll(user: AuthenticatedUser) {
    return this.repo.find({
      where: { project: { id: In(user.projectIds) } },
      relations: ['project'],
    });
  }

  async create(dto: CreateVehicleDto, user: AuthenticatedUser) {
    if (!user.projectIds.includes(dto.project_id)) {
      throw new ForbiddenException('No tienes acceso a este proyecto');
    }

    const project = await this.projectRepo.findOneBy({ id: dto.project_id });
    if (!project) throw new NotFoundException('Proyecto no encontrado');

    const vehicle = this.repo.create({
      plate: dto.plate,
      service: dto.service,
      project,
    });
    return this.repo.save(vehicle);
  }

  async update(id: string, dto: UpdateVehicleDto, user: AuthenticatedUser) {
    const vehicle = await this.repo.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');

    if (!user.projectIds.includes(vehicle.project.id)) {
      throw new ForbiddenException('No tienes acceso a este vehículo');
    }

    Object.assign(vehicle, dto);
    return this.repo.save(vehicle);
  }

  async remove(id: string, user: AuthenticatedUser) {
    const vehicle = await this.repo.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');

    if (!user.projectIds.includes(vehicle.project.id)) {
      throw new ForbiddenException('No tienes acceso a este vehículo');
    }

    return this.repo.remove(vehicle);
  }
}
