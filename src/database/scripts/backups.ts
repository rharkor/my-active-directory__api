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

function execPromise(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      if (stderr) {
        reject(stderr);
      }
      console.log(stdout);
      resolve(stdout);
    });
  });
}

export type makeBackupOptions = {
  backupType: 'full' | 'differential';
} & (
  | {
      sendViaScp: true;
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
}: makeBackupOptions) {
  //? First check if pg_dump is installed
  console.log('Checking if pg_dump is installed...');
  await execPromise(`docker exec ${dockerContainerDbName} pg_dump --version`);

  //? Then check if the .tmp folder exists
  console.log('Checking if .tmp folder exists...');
  await execPromise('mkdir -p .tmp');

  //? Then make the backup
  console.log('Making backup...');
  const backupName = `backup-${new Date().toISOString()}`;

  if (backupType === 'full') {
    //? First make the backup file
    console.log('Making full backup...');
    await execPromise(
      `docker exec ${dockerContainerDbName} /bin/bash -c "PGPASSWORD=${dbConf['db_pass']} pg_dump -U ${dbConf['db_user']} -h ${dbConf['db_host']} -p ${dbConf['db_port']} -d ${dbConf['db_name']} -F t" > .tmp/${backupName}.tar`,
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
}: restoreBackupOptions) {
  //? First check if pg_dump is installed
  console.log('Checking if pg_restore is installed...');
  await execPromise(
    `docker exec ${dockerContainerDbName} pg_restore --version`,
  );

  //? Then check if the .tmp folder exists
  console.log('Checking if .tmp folder exists...');
  await execPromise('mkdir -p .tmp');

  const execBckp = async () => {
    //? Then make the backup
    console.log('Restoring backup...');
    return execPromise(
      `docker exec -i ${dockerContainerDbName} /bin/bash -c "PGPASSWORD=${
        dbConf['db_pass']
      } pg_restore -c -U ${dbConf['db_user']} -h ${dbConf['db_host']} -p ${
        dbConf['db_port']
      } -d ${dbConf['db_name']}" < .tmp/${backupName.replace('.gzip', '.tar')}`,
    );
  };

  if (restoreFromScp) {
    //? Download the backup file
    console.log('Downloading backup file...');
    await getBackupFromServer(scpOptions, {
      serverPath: `${serverPath}/${backupName}`,
      destinationPath: `.tmp/${backupName}`,
    });
    //? Unzip the backup file
    console.log('Unzipping backup file...');
    const file = fs.readFileSync(`.tmp/${backupName}`);
    const uncompressed = await ungzip(file);
    fs.writeFileSync(
      `.tmp/${backupName.replace('.gzip', '.tar')}`,
      uncompressed,
    );
    await execBckp();
    //? Remove the backup file
    console.log('Removing tmp backup file...');
    fs.unlinkSync(`.tmp/${backupName}`);
    fs.unlinkSync(`.tmp/${backupName.replace('.gzip', '.tar')}`);
  } else {
    //? Verify if the backup file exists
    console.log('Verifying if the backup file exists...');
    await execPromise(`ls .backups/${backupName}`);

    //? Unzip the backup file
    console.log('Unzipping backup file...');
    const file = fs.readFileSync(`.backups/${backupName}`);
    const uncompressed = await ungzip(file);
    fs.writeFileSync(
      `.tmp/${backupName.replace('.gzip', '.tar')}`,
      uncompressed,
    );
    await execBckp();
    //? Remove the backup file
    console.log('Removing tmp backup file...');
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
) {
  console.log('Etablishing connexion with server...');
  const client = await Client(connexionInfo);
  console.log('Connexion etablished with server');
  console.log('Uploading backup file...');
  await client.uploadFile(
    transferInfo.backupName,
    transferInfo.destinationPath,
  );
  client.close();
  console.log('Backup file uploaded');
}

//? Get load backup from server via scp
async function getBackupFromServer(
  connexionInfo: TScpOptions,
  transferInfo: {
    serverPath: string;
    destinationPath: string;
  },
) {
  console.log('Etablishing connexion with server...');
  const client = await Client(connexionInfo);
  console.log('Connexion etablished with server');
  console.log('Downloading backup file...');
  await client.downloadFile(
    transferInfo.serverPath,
    transferInfo.destinationPath,
  );
  client.close();
  console.log('Backup file downloaded');
}
