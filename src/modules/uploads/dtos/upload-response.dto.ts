import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    example: {
      fieldname: 'file',
      originalname: 'test.txt',
      encoding: '7bit',
      mimetype: 'text/plain',
      destination: 'uploads/',
      filename: 'test.txt-1619119857878',
      path: 'uploads/test.txt-1619119857878',
      size: 0,
    },
    description: 'Uploaded file',
  })
  file: Express.Multer.File;
}
