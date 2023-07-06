import Role from '@/modules/roles/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({
    name: 'Id',
    example: 1,
  })
  id: number;

  @ApiProperty({
    name: 'Email',
    example: 'test@mail.com',
  })
  email?: string;

  @ApiProperty({
    name: 'Username',
    example: 'test',
  })
  username?: string;

  @ApiProperty({
    name: 'First name',
    example: 'John',
  })
  firstName?: string;

  @ApiProperty({
    name: 'Last name',
    example: 'Doe',
  })
  lastName?: string;

  @ApiProperty({
    name: 'Metadata',
    example: {
      key: 'value',
    },
  })
  metadata?: unknown;

  @ApiProperty({
    name: 'Roles',
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
