import { ApiProperty } from '@nestjs/swagger';

export class UpdateResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'test@mail.com',
  })
  email?: string;

  @ApiProperty({
    example: 'test',
  })
  username?: string;

  @ApiProperty({
    example: 'John',
  })
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
  })
  lastName?: string;

  @ApiProperty({
    example: {
      key: 'value',
    },
  })
  metadata?: unknown;

  @ApiProperty({
    description: 'The user tokens refreshed if (email/username) are updated',
  })
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}
