import conf from '../../config/database.configuration';
import { exec } from 'child_process';
import * as fs from 'fs';
import { gzip, ungzip } from 'node-gzip';
import { config } from 'dotenv';
import { Client, TScpOptions } from 'node-scp';
config();

const dbConf = conf();

const dockerContainerDbName =
  process.env.DOCKER_CONTAINER_DB_NAME || 'my-active-directory__db';

function execPromise(command: string, log: (message: string) => void) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      if (stderr) {
        reject(stderr);
      }
      log(stdout);
      resolve(stdout);
    });
  });
}

export type makeBackupOptions = {
  backupType: 'full' | 'differential';
  log?: (message: string) => void;
} & (
  | {
      sendViaScp: boolean;
      scpOptions: TScpOptions;
      destinationPath: string;
    }
  | {
      sendViaScp?: false;
      scpOptions?: never;
      destinationPath?: never;
    }
);

export async function makeBackup({
  backupType,
  sendViaScp,
  scpOptions,
  destinationPath,
  log = console.log,
}: makeBackupOptions) {
  //? First check if pg_dump is installed
  log('Checking if pg_dump is installed...');
  await execPromise(
    `docker exec ${dockerContainerDbName} pg_dump --version`,
    log,
  );

  //? Then check if the .tmp folder exists
  console.log('Checking if .tmp folder exists...');
  await execPromise('mkdir -p .tmp', log);

  //? Then make the backup
  console.log('Making backup...');
  const backupName = `backup-${new Date().toISOString()}`;

  if (backupType === 'full') {
    //? First make the backup file
    console.log('Making full backup...');
    await execPromise(
      `docker exec ${dockerContainerDbName} /bin/bash -c "PGPASSWORD=${dbConf['db_pass']} pg_dump -U ${dbConf['db_user']} -h ${dbConf['db_host']} -p ${dbConf['db_port']} -d ${dbConf['db_name']} -F t" > .tmp/${backupName}.tar`,
      log,
    );
    console.log('Full backup made');
    console.log('Compressing backup file...');
    const file = fs.readFileSync(`.tmp/${backupName}.tar`);
    const compressed = await gzip(file);
    fs.writeFileSync(`.tmp/${backupName}.gzip`, compressed);
    fs.unlinkSync(`.tmp/${backupName}.tar`);

    //? Then upload the backup file to .backups
    if (sendViaScp) {
      await sendBackupToServer(scpOptions, {
        backupName: `.tmp/${backupName}.gzip`,
        destinationPath: `${destinationPath}/${backupName}.gzip`,
      });
    } else {
      console.log('Uploading backup file...');
      fs.copyFileSync(`.tmp/${backupName}.gzip`, `.backups/${backupName}.gzip`);
    }

    //? Then remove the backup file
    console.log('Removing tmp backup file...');
    fs.unlinkSync(`.tmp/${backupName}.gzip`);
  } else {
    throw new Error('Differential backup not implemented yet');
  }
}

export type restoreBackupOptions = {
  backupName: string;
  log?: (message: string) => void;
} & (
  | {
      restoreFromScp: true;
      scpOptions: TScpOptions;
      serverPath: string;
    }
  | {
      restoreFromScp?: false;
      scpOptions?: never;
      serverPath?: never;
    }
);

export async function restoreBackup({
  backupName,
  scpOptions,
  restoreFromScp,
  serverPath,
  log = console.log,
}: restoreBackupOptions) {
  //? First check if pg_dump is installed
  log('Checking if pg_restore is installed...');
  await execPromise(
    `docker exec ${dockerContainerDbName} pg_restore --version`,
    log,
  );

  //? Then check if the .tmp folder exists
  log('Checking if .tmp folder exists...');
  await execPromise('mkdir -p .tmp', log);

  const execBckp = async () => {
    //? Then make the backup
    log('Restoring backup...');
    return execPromise(
      `docker exec -i ${dockerContainerDbName} /bin/bash -c "PGPASSWORD=${
        dbConf['db_pass']
      } pg_restore -c -U ${dbConf['db_user']} -h ${dbConf['db_host']} -p ${
        dbConf['db_port']
      } -d ${dbConf['db_name']}" < .tmp/${backupName.replace('.gzip', '.tar')}`,
      log,
    );
  };

  if (restoreFromScp) {
    //? Download the backup file
    log('Downloading backup file...');
    await getBackupFromServer(scpOptions, {
      serverPath: `${serverPath}/${backupName}`,
      destinationPath: `.tmp/${backupName}`,
    });
    //? Unzip the backup file
    log('Unzipping backup file...');
    const file = fs.readFileSync(`.tmp/${backupName}`);
    const uncompressed = await ungzip(file);
    fs.writeFileSync(
      `.tmp/${backupName.replace('.gzip', '.tar')}`,
      uncompressed,
    );
    await execBckp();
    //? Remove the backup file
    log('Removing tmp backup file...');
    fs.unlinkSync(`.tmp/${backupName}`);
    fs.unlinkSync(`.tmp/${backupName.replace('.gzip', '.tar')}`);
  } else {
    //? Verify if the backup file exists
    log('Verifying if the backup file exists...');
    await execPromise(`ls .backups/${backupName}`, log);

    //? Unzip the backup file
    log('Unzipping backup file...');
    const file = fs.readFileSync(`.backups/${backupName}`);
    const uncompressed = await ungzip(file);
    fs.writeFileSync(
      `.tmp/${backupName.replace('.gzip', '.tar')}`,
      uncompressed,
    );
    await execBckp();
    //? Remove the backup file
    log('Removing tmp backup file...');
    fs.unlinkSync(`.tmp/${backupName.replace('.gzip', '.tar')}`);
  }
}

//? Send via scp
async function sendBackupToServer(
  connexionInfo: TScpOptions,
  transferInfo: {
    backupName: string;
    destinationPath: string;
  },
  log: (message: string) => void = console.log,
) {
  log('Etablishing connexion with server...');
  const client = await Client(connexionInfo);
  log('Connexion etablished with server');
  log('Uploading backup file...');
  await client.uploadFile(
    transferInfo.backupName,
    transferInfo.destinationPath,
  );
  client.close();
  log('Backup file uploaded');
}

//? Get load backup from server via scp
async function getBackupFromServer(
  connexionInfo: TScpOptions,
  transferInfo: {
    serverPath: string;
    destinationPath: string;
  },
  log: (message: string) => void = console.log,
) {
  log('Etablishing connexion with server...');
  const client = await Client(connexionInfo);
  log('Connexion etablished with server');
  log('Downloading backup file...');
  await client.downloadFile(
    transferInfo.serverPath,
    transferInfo.destinationPath,
  );
  client.close();
  log('Backup file downloaded');
}

export type GetBackupsType = {
  cleanFromScp: boolean;
  scpOptions?: TScpOptions;
  serverPath?: string;
};

//? Get backups
async function getBackups(
  cleanFromScp?: boolean,
  scpOptions?: TScpOptions,
  serverPath?: string,
  log: (message: string) => void = console.log,
): Promise<
  {
    name: string;
    timestamp: number;
  }[]
> {
  if (cleanFromScp) {
    log('Etablishing connexion with server...');
    const client = await Client(scpOptions);
    log('Connexion etablished with server');
    log('Getting backups list...');
    if (!serverPath) throw new Error('serverPath is required');
    const backupsList = await client.list(serverPath);
    client.close();
    log('Backups list received');
    return backupsList.map((backup: { name: string; modifyTime: number }) => ({
      name: backup.name,
      timestamp: backup.modifyTime,
    }));
  } else {
    log('Getting backups list...');
    const backupsList = fs.readdirSync('.backups');
    log('Backups list received');
    return backupsList.map((backup) => ({
      name: backup,
      timestamp: fs.statSync(`.backups/${backup}`).mtimeMs,
    }));
  }
}

export type OldBackupsCleanerOptions = {
  olderThan: number; //? timestamp
  log?: (message: string) => void;
} & (
  | {
      cleanFromScp: boolean;
      scpOptions: TScpOptions;
      serverPath: string;
    }
  | {
      cleanFromScp?: false;
      scpOptions?: never;
      serverPath?: never;
    }
);

//? Clean old backups
export async function cleanOldBackups(
  options: OldBackupsCleanerOptions,
): Promise<void> {
  const {
    olderThan,
    cleanFromScp,
    scpOptions,
    serverPath,
    log = console.log,
  } = options;
  const backups = await getBackups(cleanFromScp, scpOptions, serverPath);
  const backupsToDelete = backups.filter(
    (backup) => backup.timestamp < olderThan,
  );
  if (backupsToDelete.length === 0) {
    log('No backups to delete');
    return;
  }
  log('Backups to delete:');
  backupsToDelete.forEach((backup) => {
    log(`- ${backup.name}`);
  });
  log('Deleting backups...');
  if (cleanFromScp) {
    const client = await Client(scpOptions);
    await Promise.all(
      backupsToDelete.map((backup) =>
        client.unlink(`${serverPath}/${backup.name}`),
      ),
    );
    client.close();
  } else {
    await Promise.all(
      backupsToDelete.map((backup) =>
        fs.promises.unlink(`.backups/${backup.name}`),
      ),
    );
  }
  log('Backups deleted');
}
