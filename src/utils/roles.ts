import { CreateRoleDto } from '@/modules/roles/dtos/create.dto';
import Role from '@/modules/roles/entities/role.entity';
import User from 'src/modules/users/entities/user.entity';

export const defaultRoles: CreateRoleDto[] = [
  {
    name: 'super-admin',
    displayName: 'Super Admin',
    description: 'Super admin of the application, can do anything',
    deletable: false,
  },
  {
    name: 'admin',
    displayName: 'Admin',
    description: 'Admin can manage users and roles',
    deletable: false,
  },
];

export const rolesWithAppAccess: CreateRoleDto[] = defaultRoles;

export const checkIfUserHaveAccessToApp = (user: User) => {
  const userRoles = user.roles?.map((role) => role.name) || [];
  const userHasAccess = rolesWithAppAccess.some((role) =>
    userRoles.includes(role.name),
  );
  return userHasAccess;
};

export const findHighestRole = (roles?: Role[]) => {
  if (!roles) return 'user';
  const roleNames = roles.map((role) => role.name);
  if (roleNames.includes('super-admin')) return 'super-admin';
  if (roleNames.includes('admin')) return 'admin';
  return 'user';
};
