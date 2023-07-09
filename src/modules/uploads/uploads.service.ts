import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadsService {
  getFile(path: string): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'uploads', path));
    return new StreamableFile(file);
  }
}
