import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GlobalConfigModule } from './config/config.module';
import { TypeOrmConfigModule } from './config/typeorm.module';
import { AuthModule } from './modules/auth/auth.module';
import { TransfersModule } from './modules/transfers/transfers.module';
import { SessionMiddleware } from './shared/middleware/session.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from './entities/user.entity';
import { AdminModule } from './modules/admin/admin.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';

@Module({
  imports: [
    GlobalConfigModule,
    TypeOrmConfigModule,
    AuthModule,
    TransfersModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({}),
    AdminModule,
    VehiclesModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
