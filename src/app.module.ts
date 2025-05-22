import { Module } from '@nestjs/common';
import { GlobalConfigModule } from './config/config.module';
import { TypeOrmConfigModule } from './config/typeorm.module';

@Module({
  imports: [GlobalConfigModule, TypeOrmConfigModule],
})
export class AppModule {}
