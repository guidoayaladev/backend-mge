import { Module } from '@nestjs/common';
import { ControllerController } from './vehicles/controller.controller';
import { ServiceService } from './vehicles/service.service';

@Module({
  controllers: [ControllerController],
  providers: [ServiceService]
})
export class VehiclesModule {}
