import { ApiProperty } from '@nestjs/swagger';

export class InitializedResponseDto {
  @ApiProperty({
    description: 'True if the backend is initialized, false otherwise',
    example: true,
  })
  initialized: boolean;
}
