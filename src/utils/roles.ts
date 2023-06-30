import { CreateRoleDto } from 'src/modules/users/dtos/createRole.dto';
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
  {
    name: 'service-account',
    displayName: 'Service Account',
    description:
      'Service account can be used for automated tasks & backend services',
    deletable: false,
  },
];

export const rolesWithAppAccess: CreateRoleDto[] = defaultRoles;

export const checkIfUserHaveAccessToApp = (user: User) => {
  const userRoles = user.roles.map((role) => role.name);
  const userHasAccess = rolesWithAppAccess.some((role) =>
    userRoles.includes(role.name),
  );
  return userHasAccess;
};
