import SysRole from '../../modules/roles/entities/sys-role.entity';
import databaseConfiguration from '../database.configuration';
import { Logger } from '@nestjs/common';
import { defaultRoles } from '../../utils/roles';

const insertDefaultRoles = async () => {
  const connection = await databaseConfiguration.initialize();

  await connection.manager.transaction(async (manager) => {
    //? Create default roles if they don't exist
    const promises: Promise<void>[] = [];
    defaultRoles.forEach((role) => {
      const promise = new Promise<void>(async (resolve, reject) => {
        try {
          const roleExists = await manager.findOne(SysRole, {
            where: {
              name: role.name,
            },
          });
          if (!roleExists) {
            await manager.insert(SysRole, role);
            Logger.log(`Created role ${role.name}`);
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      promises.push(promise);
    });

    await Promise.all(promises);
  });

  await connection.destroy();
};

insertDefaultRoles();
