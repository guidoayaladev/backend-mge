import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import * as bcrypt from 'bcrypt';

const users = [
  {
    username: 'admin',
    email: 'admin@demo.com',
    password: 'Admin#2024!',
    roles: ['admin'],
  },
  {
    username: 'operator1',
    email: 'operator1@demo.com',
    password: 'Operator#2024!',
    roles: ['operator'],
  },
  {
    username: 'viewer1',
    email: 'viewer1@demo.com',
    password: 'Viewer#2024!',
    roles: ['viewer'],
  },
];

export async function seedUsers(
  userRepo: Repository<UserEntity>,
  roleRepo: Repository<Role>,
) {
  for (const userData of users) {
    let user = await userRepo.findOne({
      where: { email: userData.email },
      relations: ['roles'],
    });
    const passwordHash = await bcrypt.hash(userData.password, 10);

    const roles = await roleRepo.find({
      where: userData.roles.map((name) => ({ name })),
    });

    if (!user) {
      user = userRepo.create({
        username: userData.username,
        email: userData.email,
        password_hash: passwordHash,
        roles,
        projects: [],
        organizationalUnits: [],
      });
      await userRepo.save(user);
      console.log(`✅ Usuario creado: ${userData.email}`);
    } else {
      user.password_hash = passwordHash;
      user.roles = roles;
      user.projects = [];
      user.organizationalUnits = [];
      await userRepo.save(user);
      console.log(`✅ Usuario actualizado: ${userData.email}`);
    }
  }
}
