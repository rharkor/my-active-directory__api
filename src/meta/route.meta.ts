/* eslint-disable @typescript-eslint/ban-types */
import {
  All,
  Delete,
  Get,
  Head,
  Options,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Public } from './public.meta';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiAvailable } from './api.meta';
import { Roles } from './roles.meta';

export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
  Patch = 'PATCH',
  Options = 'OPTIONS',
  Head = 'HEAD',
  All = 'ALL',
}

export type RouteType = {
  isPublic?: boolean;
  isApiAvailable?: boolean;
  useGuards?: Parameters<typeof UseGuards>;
  throttle?: Parameters<typeof Throttle>;
  swagger?: {
    tags?: (() => Parameters<typeof ApiTags>) | Parameters<typeof ApiTags>[0][];
    operation?:
      | (() => Parameters<typeof ApiOperation>[0])
      | Parameters<typeof ApiOperation>[0];
    responses?:
      | (() => Parameters<typeof ApiResponse>[0][])
      | Parameters<typeof ApiResponse>[0][]
      | Parameters<typeof ApiResponse>[0];
    bearerAuth?: boolean;
  };
  method: HttpMethod;
  path?: string | string[];
  roles?: Parameters<typeof Roles>;
};

/**
 * Create all route decorators
 *
 * Example: `@Route({isPublic: true})`
 */
export const Route = ({
  isPublic,
  isApiAvailable,
  useGuards,
  throttle,
  swagger,
  method,
  path,
  roles,
}: RouteType): MethodDecorator => {
  return (target, key, descriptor: PropertyDescriptor) => {
    if (isPublic) {
      Public()(target, key, descriptor);
    }

    if (isApiAvailable) {
      ApiAvailable()(target, key, descriptor);
    }

    if (useGuards) {
      useGuards.forEach((guard) => {
        UseGuards(guard)(target, key, descriptor);
      });
    }

    if (throttle) {
      Throttle(...throttle)(target, key, descriptor);
    }

    if (swagger) {
      if (swagger.tags) {
        //? If swagger.tags is a function, call it, otherwise use it as is
        ApiTags(
          ...(typeof swagger.tags === 'function'
            ? swagger.tags()
            : swagger.tags),
        )(target, key, descriptor);
      }
      if (swagger.operation) {
        //? If swagger.operation is a function, call it, otherwise use it as is
        ApiOperation(
          typeof swagger.operation === 'function'
            ? swagger.operation()
            : swagger.operation,
        )(target, key, descriptor);
      }
      if (swagger.responses) {
        //? If swagger.responses is a function, call it, otherwise use it as is
        (typeof swagger.responses === 'function'
          ? swagger.responses()
          : Array.isArray(swagger.responses)
          ? swagger.responses
          : [swagger.responses]
        ).forEach((response) => {
          ApiResponse(response)(target, key, descriptor);
        });
      }

      if (
        swagger.bearerAuth === true ||
        (swagger.bearerAuth === undefined && !isPublic)
      ) {
        ApiBearerAuth()(target, key, descriptor);
      }

      if (isApiAvailable) {
        ApiSecurity('x-api-key')(target, key, descriptor);
      }
    }

    if (method === HttpMethod.All) {
      All(path)(target, key, descriptor);
    } else if (method === HttpMethod.Get) {
      Get(path)(target, key, descriptor);
    } else if (method === HttpMethod.Post) {
      Post(path)(target, key, descriptor);
    } else if (method === HttpMethod.Put) {
      Put(path)(target, key, descriptor);
    } else if (method === HttpMethod.Delete) {
      Delete(path)(target, key, descriptor);
    } else if (method === HttpMethod.Patch) {
      Patch(path)(target, key, descriptor);
    } else if (method === HttpMethod.Options) {
      Options(path)(target, key, descriptor);
    } else if (method === HttpMethod.Head) {
      Head(path)(target, key, descriptor);
    }

    if (roles) {
      Roles(...roles)(target, key, descriptor);
    }

    return descriptor;
  };
};
