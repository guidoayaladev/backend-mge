import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfer } from 'src/entities/transfer.entity';
import { Repository, In } from 'typeorm';
import { CreateTransferDto } from '../dtos/create-transfer.dto';
import { UpdateTransferDto } from '../dtos/update-transfer.dto';
import { Vehicle } from 'src/entities/vehicle.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Project } from 'src/entities/project.entity';
import { OrganizationalUnit } from 'src/entities/organizational-unit.entity';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private readonly transferRepo: Repository<Transfer>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(OrganizationalUnit)
    private readonly unitRepo: Repository<OrganizationalUnit>,
  ) {}

  async findAll(user: any) {
    return this.transferRepo.find({
      where: {
        project: { id: In(user.projectIds) },
        organizationalUnit: { id: In(user.unitIds) },
      },
      relations: [
        'vehicle',
        'client',
        'transmitter',
        'project',
        'organizationalUnit',
      ],
    });
  }

  async create(dto: CreateTransferDto, user: any) {
    if (!user.projectIds.includes(dto.project_id)) {
      throw new ForbiddenException('No tienes acceso a este proyecto');
    }
    if (!user.unitIds.includes(dto.organizational_unit_id)) {
      throw new ForbiddenException(
        'No tienes acceso a esta unidad organizativa',
      );
    }

    const { vehicle, client, transmitter, project, organizationalUnit } =
      await this.loadTransferRelationsOrThrow(dto);

    const transfer = this.transferRepo.create({
      type: dto.type,
      vehicle,
      client,
      transmitter,
      project,
      organizationalUnit,
    });

    return this.transferRepo.save(transfer);
  }

  async update(id: string, dto: UpdateTransferDto, user: any) {
    const transfer = await this.getTransferWithAccessCheckOrThrow(id, user, {
      checkEdit: true,
    });

    Object.assign(transfer, dto);
    return this.transferRepo.save(transfer);
  }

  async remove(id: string, user: any) {
    const transfer = await this.getTransferWithAccessCheckOrThrow(id, user, {
      checkDelete: true,
    });

    return this.transferRepo.remove(transfer);
  }

  private async loadTransferRelationsOrThrow(dto: CreateTransferDto) {
    const [vehicle, client, transmitter, project, organizationalUnit] =
      await Promise.all([
        this.vehicleRepo.findOneBy({ id: dto.vehicle_id }),
        this.userRepo.findOneBy({ id: dto.client_id }),
        this.userRepo.findOneBy({ id: dto.transmitter_id }),
        this.projectRepo.findOneBy({ id: dto.project_id }),
        this.unitRepo.findOne({
          where: { id: dto.organizational_unit_id },
          relations: ['project'],
        }),
      ]);

    if (!vehicle) throw new NotFoundException('Vehículo no encontrado');
    if (!client) throw new NotFoundException('Cliente no encontrado');
    if (!transmitter) throw new NotFoundException('Transmisor no encontrado');
    if (!project) throw new NotFoundException('Proyecto no encontrado');
    if (!organizationalUnit)
      throw new NotFoundException('Unidad organizativa no encontrada');

    // ❗ Validar que la unidad pertenezca al proyecto
    if (organizationalUnit.project.id !== project.id) {
      throw new ForbiddenException(
        'La unidad organizativa no pertenece al proyecto especificado',
      );
    }

    return { vehicle, client, transmitter, project, organizationalUnit };
  }

  private async getTransferWithAccessCheckOrThrow(
    id: string,
    user: any,
    options: { checkEdit?: boolean; checkDelete?: boolean } = {},
  ) {
    const transfer = await this.transferRepo.findOne({
      where: { id },
      relations: ['organizationalUnit', 'project'],
    });

    if (!transfer) throw new NotFoundException('Transferencia no encontrada');

    const { organizationalUnit, project } = transfer;

    if (options.checkEdit) {
      if (
        !user.projectIds.includes(project.id) ||
        !user.unitIds.includes(organizationalUnit.id)
      ) {
        throw new ForbiddenException(
          'No tienes permiso para editar esta transferencia',
        );
      }
    }

    if (options.checkDelete) {
      if (!user.unitIds.includes(organizationalUnit.id)) {
        throw new ForbiddenException(
          'No tienes permiso para eliminar esta transferencia',
        );
      }
    }

    return transfer;
  }
}
