import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferController } from './controller/transfer.controller';
import { TransferService } from './service/transfer.service';
import { Transfer } from 'src/entities/transfer.entity';
import { Vehicle } from 'src/entities/vehicle.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Project } from 'src/entities/project.entity';
import { OrganizationalUnit } from 'src/entities/organizational-unit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transfer,
      Vehicle,
      UserEntity,
      Project,
      OrganizationalUnit,
    ]),
  ],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransfersModule {}
