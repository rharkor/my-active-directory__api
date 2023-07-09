import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import User from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(CronService.name);

  async cleanUnused() {
    this.logger.log('Cleaning unused files');
    //? Clean all files that are not used by any users
    const allUsersProfilePictures = await this.usersRepository
      .createQueryBuilder('user')
      .select("metadata->>'profilePicture'")
      .where("metadata->>'profilePicture' IS NOT NULL")
      .getRawMany();
    const allFiles = fs.readdirSync('uploads');
    const usedFiles = new Set<string>();
    allUsersProfilePictures.forEach((filename) => {
      if (filename) usedFiles.add(filename);
    });
    const unusedFiles = allFiles.filter((file) => !usedFiles.has(file));
    unusedFiles.forEach((file) => {
      fs.unlinkSync(path.join('uploads', file));
    });
    this.logger.log(`Cleaned ${unusedFiles.length} files`);
  }

  @Cron('0 * * * *') // Every hour
  //@Cron('*/10 * * * * *') // Every 10 seconds
  async handleCron() {
    this.cleanUnused();
  }
}
