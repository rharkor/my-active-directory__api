import { makeBackup } from './backups';

async function makeBackupCli() {
  makeBackup({
    backupType: 'full',
  });
}

makeBackupCli();
