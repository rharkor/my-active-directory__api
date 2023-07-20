import { CreateDto as CreateRoleDto } from '@/modules/roles/dtos/create.dto';
import SysRole from '@/modules/roles/entities/sys-role.entity';
import User from 'src/modules/users/entities/user.entity';

export const defaultRoles: CreateRoleDto[] = [
  {
    name: 'super-admin',
    displayName: 'Super Admin',
    description: 'Super admin of the application, can do anything',
    color: '#ff4d4d', //? Red
  },
  {
    name: 'admin',
    displayName: 'Admin',
    description: 'Admin can manage users and roles',
    color: '#FFA500', //? Orange
  },
];

export const rolesWithAppAccess: CreateRoleDto[] = defaultRoles;

export const checkIfUserHaveAccessToApp = (user: User) => {
  const userRoles = user.sysroles?.map((role) => role.name) || [];
  const userHasAccess = rolesWithAppAccess.some((role) =>
    userRoles.includes(role.name),
  );
  return userHasAccess;
};

export const findHighestRole = (roles?: SysRole[]) => {
  if (!roles) return 'user';
  const roleNames = roles.map((role) => role.name);
  if (roleNames.includes('super-admin')) return 'super-admin';
  if (roleNames.includes('admin')) return 'admin';
  return 'user';
};
