import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { UserEntity } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';
import { Project } from 'src/entities/project.entity';
import { OrganizationalUnit } from 'src/entities/organizational-unit.entity';
import { AppDataSource } from 'src/config/data-source';

config();

const permissions = [
  'view_transfers',
  'create_transfers',
  'edit_transfers',
  'delete_transfers',
  'manage_users',
];

const roles = {
  admin: [
    'view_transfers',
    'create_transfers',
    'edit_transfers',
    'delete_transfers',
    'manage_users',
  ],
  operator: ['view_transfers', 'create_transfers', 'edit_transfers'],
  viewer: ['view_transfers'],
};

async function seed() {
  await AppDataSource.initialize();

  const permissionRepo = AppDataSource.getRepository(Permission);
  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(UserEntity);
  const projectRepo = AppDataSource.getRepository(Project);
  const unitRepo = AppDataSource.getRepository(OrganizationalUnit);

  const permissionEntities: Permission[] = [];
  for (const name of permissions) {
    let permission = await permissionRepo.findOne({ where: { name } });
    if (!permission) {
      permission = permissionRepo.create({ name, description: name });
      await permissionRepo.save(permission);
    }
    permissionEntities.push(permission);
  }

  for (const [roleName, perms] of Object.entries(roles)) {
    let role = await roleRepo.findOne({
      where: { name: roleName },
      relations: ['permissions'],
    });
    if (!role) {
      role = roleRepo.create({
        name: roleName,
        description: `${roleName} role`,
        permissions: permissionEntities.filter((p) => perms.includes(p.name)),
      });
      await roleRepo.save(role);
    }
  }

  let project = await projectRepo.findOne({
    where: { name: 'Proyecto Central' },
  });
  if (!project) {
    project = projectRepo.create({
      name: 'Proyecto Central',
      description: 'Proyecto inicial',
    });
    await projectRepo.save(project);
  }

  let unit = await unitRepo.findOne({ where: { name: 'Unidad Principal' } });
  if (!unit) {
    unit = unitRepo.create({ name: 'Unidad Principal', project });
    await unitRepo.save(unit);
  }

  const adminEmail = 'admin@demo.com';
  let user = await userRepo.findOne({
    where: { email: adminEmail },
    relations: ['roles'],
  });
  const passwordHash = await bcrypt.hash('Admin#2024!', 10);
  const adminRole = await roleRepo.findOne({
    where: { name: 'admin' },
    relations: ['permissions'],
  });

  if (!adminRole) {
    throw new Error(
      '❌ Rol "admin" no encontrado. Asegúrate de correr la parte de roles primero.',
    );
  }

  if (!user) {
    user = userRepo.create({
      username: 'admin',
      email: adminEmail,
      password_hash: passwordHash,
      roles: [adminRole],
      projects: [project],
      organizationalUnits: [unit],
    });

    await userRepo.save(user);
    console.log(
      '✅ Usuario administrador creado con: admin@demo.com / Admin#2024!',
    );
  } else {
    user.password_hash = passwordHash;
    user.roles = [adminRole];
    user.projects = [project];
    user.organizationalUnits = [unit];

    await userRepo.save(user);
    console.log('✅ Usuario administrador actualizado .');
  }

  await AppDataSource.destroy();
}

seed()
  .then(() => console.log('✅ Seed finalizado'))
  .catch((err) => {
    console.error('❌ Error ejecutando el seed:', err);
    process.exit(1);
  });
