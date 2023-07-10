import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import User from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { cleanOldBackups, makeBackup } from '@/database/scripts/backups';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger('CRON');

  async cleanUnused() {
    this.logger.log('Cleaning unused files');
    //? Clean all files that are not used by any users
    const allUsersProfilePictures = (await this.usersRepository
      .createQueryBuilder('user')
      .select("metadata->>'avatar' as avatar")
      .where("metadata->>'avatar' IS NOT NULL")
      .getRawMany()) as { avatar: string }[];
    const allFiles = fs.readdirSync('uploads').map((file) => `uploads/${file}`);
    const usedFiles = new Set<string>();
    allUsersProfilePictures.forEach((filename) => {
      if (filename) usedFiles.add(filename.avatar);
    });
    const unusedFiles = allFiles.filter((file) => !usedFiles.has(file));
    unusedFiles.forEach((file) => {
      fs.unlinkSync(file);
    });
    this.logger.log(`Cleaned ${unusedFiles.length} files`);
  }

  async makeBackup() {
    this.logger.log('Making backup');
    //? Make a backup of the database
    const scpOptions = {
      host: process.env.BACKUPS_HOST,
      port: parseInt(process.env.BACKUPS_PORT || '22'),
      username: process.env.BACKUPS_USERNAME,
      password: process.env.BACKUPS_PASSWORD,
      privateKey: process.env.BACKUPS_PRIVATE_KEY,
    };
    const useScp = process.env.BACKUPS_USE_SCP === 'true';
    const backupsPath = process.env.BACKUPS_PATH;
    if (useScp && !backupsPath) throw new Error('BACKUPS_PATH is not defined');

    await makeBackup({
      backupType: 'full',
      sendViaScp: useScp,
      scpOptions: scpOptions,
      destinationPath: backupsPath || '',
      log: this.logger.log,
    });

    this.logger.log('Backup made');
  }

  async cleanOldBackups() {
    this.logger.log('Cleaning old backups');
    //? Clean all backups that are older than 1 week
    const scpOptions = {
      host: process.env.BACKUPS_HOST,
      port: parseInt(process.env.BACKUPS_PORT || '22'),
      username: process.env.BACKUPS_USERNAME,
      password: process.env.BACKUPS_PASSWORD,
      privateKey: process.env.BACKUPS_PRIVATE_KEY,
    };
    const useScp = process.env.BACKUPS_USE_SCP === 'true';
    const backupsPath = process.env.BACKUPS_PATH;
    if (useScp && !backupsPath) throw new Error('BACKUPS_PATH is not defined');

    cleanOldBackups({
      olderThan: Date.now() - 3 * 7 * 24 * 60 * 60 * 1000, // 3 weeks
      cleanFromScp: useScp,
      scpOptions: scpOptions,
      serverPath: backupsPath || '',
      log: this.logger.log,
    });

    this.logger.log('Cleaned old backups');
  }

  @Cron('0 0 * * *') // Every day at midnight
  // @Cron('*/15 * * * * *') // Every 15 seconds
  async handleCron() {
    await this.cleanUnused();

    //? Make a backup of the database only in production
    if (process.env.NODE_ENV === 'production') {
      await this.makeBackup();
      await this.cleanOldBackups();
    }
  }
}
