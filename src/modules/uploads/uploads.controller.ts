import { Controller, UploadedFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { HttpMethod, Route } from '@/meta/route.meta';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadResponseDto } from './dtos/upload-response.dto';

@Controller('uploads')
@ApiTags('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Route({
    isApiAvailable: true,
    method: HttpMethod.Post,
    path: 'upload',
    useInterceptors: [FileInterceptor('file')],
  })
  upload(@UploadedFile() file: Express.Multer.File): UploadResponseDto {
    return { file };
  }
}
