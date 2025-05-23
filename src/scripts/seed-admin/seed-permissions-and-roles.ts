import { Repository } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';

const permissionList = [
  // Transfers
  'view_transfers',
  'create_transfers',
  'edit_transfers',
  'delete_transfers',

  // Admin/Users
  'manage_users',

  // Vehicles
  'view_vehicles',
  'create_vehicles',
  'edit_vehicles',
  'delete_vehicles',

  // Projects
  'view_projects',
  'create_projects',
  'edit_projects',
  'delete_projects',

  // Organizational Units
  'view_organizational_units',
  'create_organizational_units',
  'edit_organizational_units',
  'delete_organizational_units',
];

const roles = {
  admin: permissionList,

  operator: permissionList.filter(
    (p) =>
      p.startsWith('view_') || p.startsWith('create_') || p.startsWith('edit_'),
  ),

  viewer: permissionList.filter((p) => p.startsWith('view_')),
};

export async function seedPermissionsAndRoles(
  permissionRepo: Repository<Permission>,
  roleRepo: Repository<Role>,
) {
  const permissionEntities: Permission[] = [];

  // 📌 Crea todos los permisos si no existen
  for (const name of permissionList) {
    let permission = await permissionRepo.findOne({ where: { name } });

    if (!permission) {
      permission = permissionRepo.create({ name, description: name });
      await permissionRepo.save(permission);
      console.log(`✅ Permiso creado: ${name}`);
    }

    permissionEntities.push(permission);
  }

  // 📌 Crea roles y asigna permisos
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
      console.log(`✅ Rol creado: ${roleName}`);
    } else {
      // 🔄 Si el rol ya existe, actualiza sus permisos
      role.permissions = permissionEntities.filter((p) =>
        perms.includes(p.name),
      );
      await roleRepo.save(role);
      console.log(`🔁 Rol actualizado: ${roleName}`);
    }
  }

  return permissionEntities;
}
