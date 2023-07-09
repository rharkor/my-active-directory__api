import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export const uploadConfig = {
  dest: './uploads',
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB
    fieldNameSize: 100,
    fields: 100,
    files: 10,
    fieldSize: 1024 * 1024 * 10,
    headerPairs: 2000,
    parts: 100,
  },
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const date = Date.now().toString();
      const filename = `${date}-${file.originalname}`;
      cb(null, filename);
    },
  }),
};

export const UploadConfig = MulterModule.register(uploadConfig);
