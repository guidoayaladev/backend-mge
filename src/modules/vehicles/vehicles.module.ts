import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from 'src/entities/vehicle.entity';
import { Project } from 'src/entities/project.entity';
import { VehicleController } from './controller/vehicle.controller';
import { VehicleService } from './services/vehicle.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Project])],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehiclesModule {}
