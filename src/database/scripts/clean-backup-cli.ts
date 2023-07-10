import { cleanOldBackups } from './backups';

async function cleanBackupCli() {
  cleanOldBackups({
    olderThan: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1 week
  });
}

cleanBackupCli();
