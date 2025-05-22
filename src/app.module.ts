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
import { ProjectsModule } from './modules/projects/projects.module';
import { OrganizationalUnitsModule } from './modules/organizational-units/organizational-units.module';

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
    ProjectsModule,
    OrganizationalUnitsModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
