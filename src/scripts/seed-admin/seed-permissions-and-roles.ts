import { Repository } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';

const permissionList = [
  'view_transfers',
  'create_transfers',
  'edit_transfers',
  'delete_transfers',
  'manage_users',
];

const roles = {
  admin: permissionList,
  operator: ['view_transfers', 'create_transfers', 'edit_transfers'],
  viewer: ['view_transfers'],
};

export async function seedPermissionsAndRoles(
  permissionRepo: Repository<Permission>,
  roleRepo: Repository<Role>,
) {
  const permissionEntities: Permission[] = [];

  for (const name of permissionList) {
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
      console.log(`✅ Rol creado: ${roleName}`);
    }
  }

  return permissionEntities;
}
