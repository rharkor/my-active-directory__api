import ServiceAccount from '@/modules/service-account/entities/service-account.entity';
import Role from '@/modules/roles/entities/role.entity';
import { Request } from 'express';
import User from 'src/modules/users/entities/user.entity';

export type PayloadType = {
  id: number;
  email?: string | undefined;
  username?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  metadata?: Record<string, unknown> | undefined;
  roles?: Role[];
};

export type RequestWithUser = Request & { user: User };
export type RequestWithServiceAccount = Request & { api: ServiceAccount };
