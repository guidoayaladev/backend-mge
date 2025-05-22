import { Module } from '@nestjs/common';
import { GlobalConfigModule } from './config/config.module';
import { TypeOrmConfigModule } from './config/typeorm.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransfersModule } from './modules/transfers/transfers.module';

@Module({
  imports: [GlobalConfigModule, TypeOrmConfigModule, AuthModule, TransfersModule],
})
export class AppModule {}
