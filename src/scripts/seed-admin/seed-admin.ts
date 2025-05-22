import { AppDataSource } from 'src/config/data-source';
import { seedPermissionsAndRoles } from './seed-permissions-and-roles';
import { seedUsers } from './seed-users';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { UserEntity } from 'src/entities/user.entity';

async function runSeeds() {
  await AppDataSource.initialize();

  const permissionRepo = AppDataSource.getRepository(Permission);
  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(UserEntity);

  await seedPermissionsAndRoles(permissionRepo, roleRepo);
  await seedUsers(userRepo, roleRepo);

  console.log('🌱 Seed completado sin proyectos ni unidades');
  process.exit(0);
}

runSeeds().catch((err) => {
  console.error('❌ Error en el seeding:', err);
  process.exit(1);
});
