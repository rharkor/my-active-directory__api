import Role from '@/modules/roles/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneResponseDto {
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
    example: [
      {
        id: 2,
        name: 'super-admin',
        displayName: 'Super Admin',
        description: 'Super admin of the application, can do anything',
      },
    ],
  })
  roles?: Role[];
}
