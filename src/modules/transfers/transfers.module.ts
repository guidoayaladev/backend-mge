import { Module } from '@nestjs/common';
import { TransferController } from './controller/transfer.controller';
import { TransferService } from './service/transfer.service';

@Module({
  controllers: [TransferController],
  providers: [TransferService]
})
export class TransfersModule {}
