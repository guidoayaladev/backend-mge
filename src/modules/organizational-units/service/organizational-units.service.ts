import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationalUnit } from 'src/entities/organizational-unit.entity';
import { Repository, In } from 'typeorm';
import { CreateOrganizationalUnitDto } from '../dto/create-organizational-unit.dto';
import { UpdateOrganizationalUnitDto } from '../dto/update-organizational-unit.dto';
import { Project } from 'src/entities/project.entity';
import { AuthenticatedUser } from 'src/shared/types/authenticated-user.interface';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class OrganizationalUnitService {
  constructor(
    @InjectRepository(OrganizationalUnit)
    private readonly unitRepo: Repository<OrganizationalUnit>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findAll(user: AuthenticatedUser) {
    return this.unitRepo.find({
      where: { project: { id: In(user.projectIds) } },
      relations: ['project'],
    });
  }

  async create(dto: CreateOrganizationalUnitDto, user: AuthenticatedUser) {
    if (!user.projectIds.includes(dto.project_id)) {
      throw new ForbiddenException('No tienes acceso a este proyecto');
    }

    const project = await this.projectRepo.findOneBy({ id: dto.project_id });
    if (!project) throw new NotFoundException('Proyecto no encontrado');

    const unit = this.unitRepo.create({
      name: dto.name,
      project,
    });

    return this.unitRepo.save(unit);
  }

  async update(
    id: string,
    dto: UpdateOrganizationalUnitDto,
    user: AuthenticatedUser,
  ) {
    const unit = await this.unitRepo.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!unit) throw new NotFoundException('Unidad organizativa no encontrada');

    if (!user.projectIds.includes(unit.project.id)) {
      throw new ForbiddenException('No tienes acceso a esta unidad');
    }

    Object.assign(unit, dto);
    return this.unitRepo.save(unit);
  }

  async remove(id: string, user: AuthenticatedUser) {
    const unit = await this.unitRepo.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!unit) throw new NotFoundException('Unidad organizativa no encontrada');

    if (!user.projectIds.includes(unit.project.id)) {
      throw new ForbiddenException('No tienes acceso a esta unidad');
    }

    return this.unitRepo.remove(unit);
  }

  async linkUserToUnit(
    unitId: string,
    targetUserId: string,
    currentUser: AuthenticatedUser,
  ) {
    const unit = await this.unitRepo.findOne({
      where: { id: unitId },
      relations: ['project'],
    });
    if (!unit) throw new NotFoundException('Unidad organizativa no encontrada');

    if (
      !currentUser.projectIds.includes(unit.project.id) ||
      !currentUser.permissions.includes('create_units')
    ) {
      throw new ForbiddenException(
        'No tienes permisos para asignar usuarios a esta unidad organizativa',
      );
    }

    const user = await this.userRepo.findOne({
      where: { id: targetUserId },
      relations: ['organizationalUnits'],
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const alreadyAssigned = user.organizationalUnits.some(
      (u) => u.id === unitId,
    );
    if (alreadyAssigned) {
      throw new BadRequestException(
        'El usuario ya está asignado a esta unidad',
      );
    }

    user.organizationalUnits.push(unit);
    await this.userRepo.save(user);

    return { message: 'Usuario asignado correctamente a la unidad' };
  }
}
