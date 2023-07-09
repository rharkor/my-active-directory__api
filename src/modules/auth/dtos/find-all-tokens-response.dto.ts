import { ApiPaginationResponse } from '@/types';
import { TokenUA } from '../entities/token.entity';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllTokensResponseDto extends ApiPaginationResponse {
  @ApiProperty({
    description: 'Tokens (see: https://www.npmjs.com/package/ua-parser-js)',
    example: [
      {
        ua: '',
        browser: {},
        engine: {},
        os: {},
        device: {},
        cpu: {},
      },
    ],
  })
  data: TokenUA[];
}
