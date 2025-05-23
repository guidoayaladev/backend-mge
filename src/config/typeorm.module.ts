import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { UserEntity } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { Project } from '../entities/project.entity';
import { OrganizationalUnit } from '../entities/organizational-unit.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { Transfer } from '../entities/transfer.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = config.get<string>('DATABASE_URL') ?? '';
        const isExternal =
          !dbUrl.includes('localhost') && !dbUrl.includes('127.0.0.1');

        return {
          type: 'postgres',
          url: dbUrl,
          synchronize: false,
          autoLoadEntities: true,
          logging: false,
          ...(isExternal ? { ssl: { rejectUnauthorized: false } } : {}),
          entities: [
            UserEntity,
            Role,
            Permission,
            Project,
            OrganizationalUnit,
            Vehicle,
            Transfer,
          ],
          migrations: [join(__dirname, '..', '..', 'migrations', '*.{ts,js}')],
        };
      },
    }),
  ],
})
export class TypeOrmConfigModule {}
