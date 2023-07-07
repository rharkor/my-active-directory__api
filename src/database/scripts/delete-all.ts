import databaseConfiguration from '../database.configuration';

const deleteAll = async () => {
  if (process.env.ENV !== 'dev')
    throw 'You can delete all data only in dev environment';
  const connection = await databaseConfiguration.initialize();
  const sqls: string[] = ['user', 'service_account', 'user_roles_role', 'role'];
  for (const sql of sqls) {
    await connection.query(`DELETE FROM "${sql}"`).catch((error) => {
      console.error(error);
    });
    console.log(`Deleted all data from ${sql}`);
  }
  await connection.destroy();
};

deleteAll();
