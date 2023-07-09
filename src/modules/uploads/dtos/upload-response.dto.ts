import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    example: {
      fieldname: 'file',
      originalname: 'test.txt',
      encoding: '7bit',
      mimetype: 'text/plain',
      size: 0,
      buffer: Buffer.from(''),
      filename: 'test.txt',
      path: 'uploads/test.txt',
    },
    description: 'Uploaded file',
  })
  file: Express.Multer.File;
}
