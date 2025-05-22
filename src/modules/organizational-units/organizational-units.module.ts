import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationalUnitService } from './service/organizational-units.service';
import { OrganizationalUnitController } from './controller/organizational-units.controller';

import { OrganizationalUnit } from 'src/entities/organizational-unit.entity';
import { Project } from 'src/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationalUnit, Project])],
  controllers: [OrganizationalUnitController],
  providers: [OrganizationalUnitService],
})
export class OrganizationalUnitsModule {}
