import * as enquirer from 'enquirer';

import { restoreBackup } from './backups';

async function restoreBackupCli() {
  const res = (await enquirer.prompt({
    type: 'input',
    name: 'backupName',
    message: 'What is the name of the backup file?',
  })) as { backupName: string };

  restoreBackup({
    backupName: res.backupName,
  });
}

restoreBackupCli();
