import {
  BadRequestException,
  Controller,
  Param,
  StreamableFile,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { HttpMethod, Route } from '@/meta/route.meta';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadResponseDto } from './dtos/upload-response.dto';
import { uploadConfig } from '@/config/upload.configuration';

@Controller('uploads')
@ApiTags('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Route({
    isApiAvailable: true,
    method: HttpMethod.Post,
    path: 'upload',
    useInterceptors: [FileInterceptor('file', uploadConfig)],
    swagger: {
      responses: {
        status: 201,
        description: 'Uploaded',
        type: UploadResponseDto,
      },
    },
  })
  upload(@UploadedFile() file: Express.Multer.File): UploadResponseDto {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return { file };
  }

  @Route({
    isPublic: true,
    method: HttpMethod.Get,
    path: ':path',
    swagger: {
      responses: {
        status: 200,
        description: 'File',
      },
    },
  })
  getFile(@Param('path') path: string): StreamableFile {
    if (!path) {
      throw new BadRequestException('No path provided');
    }

    return this.uploadsService.getFile(path);
  }
}
