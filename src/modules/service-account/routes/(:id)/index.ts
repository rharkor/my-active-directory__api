import { ApiRouteDocumentation } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceAccountService } from '../../service-account.service';
import { UpdateServiceAccountDto } from '../../dtos/service-account-update.dto';

/*
 * Find one
 */
class ResponseFindOne200 {
  @ApiProperty({
    description: 'Id',
  })
  id: number;

  @ApiProperty({
    description: 'Name',
  })
  name: string;
}

class DocumentationFindOne implements ApiRouteDocumentation {
  bearerAuth = true;

  tags: () => string[];

  operation = () => ({
    summary: 'Find one',
    description: 'Retrieve one service account',
  });

  responses = () => [
    {
      status: 200,
      description: 'Success',
      type: ResponseFindOne200,
    },
  ];
}

const handlerFindOne = ({
  id,
  serviceAccountService,
}: {
  id: number;
  serviceAccountService: ServiceAccountService;
}) => serviceAccountService.findOne(id);

export const serviceAccountFindOne = {
  handler: handlerFindOne,
  Documentation: DocumentationFindOne,
  Response: ResponseFindOne200,
};

/*
 * Update
 */
class ResponseUpdate200 {
  @ApiProperty({
    description: 'Generated maps',
  })
  generatedMaps: unknown[];

  @ApiProperty({
    description: 'Raw',
  })
  raw: unknown[];

  @ApiProperty({
    description: 'Affected',
  })
  affected: number;
}

class DocumentationUpdate implements ApiRouteDocumentation {
  bearerAuth = true;

  tags: () => string[];

  operation = () => ({
    summary: 'Update',
    description: 'Update one service account',
  });

  responses = () => [
    {
      status: 200,
      description: 'Success',
      type: ResponseUpdate200,
    },
  ];
}

const handlerUpdate = ({
  id,
  updateServiceAccountDto,
  serviceAccountService,
}: {
  id: number;
  updateServiceAccountDto: UpdateServiceAccountDto;
  serviceAccountService: ServiceAccountService;
}) => serviceAccountService.update(id, updateServiceAccountDto);

export const serviceAccountUpdate = {
  handler: handlerUpdate,
  Documentation: DocumentationUpdate,
  Response: ResponseUpdate200,
};

/*
 * Remove
 */
class ResponseRemove200 {
  @ApiProperty({
    description: 'Raw',
  })
  raw: unknown[];

  @ApiProperty({
    description: 'Affected',
  })
  affected: number;
}

class DocumentationRemove implements ApiRouteDocumentation {
  bearerAuth = true;

  tags: () => string[];

  operation = () => ({
    summary: 'Remove',
    description: 'Remove a service account',
  });

  responses = () => [
    {
      status: 200,
      description: 'Success',
      type: ResponseRemove200,
    },
  ];
}

const handlerRemove = ({
  id,
  serviceAccountService,
}: {
  id: number;
  serviceAccountService: ServiceAccountService;
}) => serviceAccountService.remove(id);

export const serviceAccountRemove = {
  handler: handlerRemove,
  Documentation: DocumentationRemove,
  Response: ResponseRemove200,
};
