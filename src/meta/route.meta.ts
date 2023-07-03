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
  ApiTags,
} from '@nestjs/swagger';
import { ApiAvailable } from './api.meta';
import { Roles } from './roles.meta';

type AvailableMetods =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head'
  | 'all';

export type RouteType = {
  isPublic?: boolean;
  isApiAvailable?: boolean;
  useGuards?: Parameters<typeof UseGuards>;
  throttle?: Parameters<typeof Throttle>;
  swagger?: {
    tags: () => Parameters<typeof ApiTags>;
    operation: () => Parameters<typeof ApiOperation>[0];
    responses: () => Parameters<typeof ApiResponse>[0][];
    bearerAuth?: boolean;
  };
  method: AvailableMetods;
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
        ApiTags(...swagger.tags())(target, key, descriptor);
      }
      if (swagger.operation) {
        ApiOperation(swagger.operation())(target, key, descriptor);
      }
      if (swagger.responses) {
        swagger.responses().forEach((response) => {
          ApiResponse(response)(target, key, descriptor);
        });
      }

      if (swagger.bearerAuth) {
        ApiBearerAuth()(target, key, descriptor);
      }
    }

    if (method === 'all') {
      All(path)(target, key, descriptor);
    } else if (method === 'get') {
      Get(path)(target, key, descriptor);
    } else if (method === 'post') {
      Post(path)(target, key, descriptor);
    } else if (method === 'put') {
      Put(path)(target, key, descriptor);
    } else if (method === 'delete') {
      Delete(path)(target, key, descriptor);
    } else if (method === 'patch') {
      Patch(path)(target, key, descriptor);
    } else if (method === 'options') {
      Options(path)(target, key, descriptor);
    } else if (method === 'head') {
      Head(path)(target, key, descriptor);
    }

    if (roles) {
      Roles(...roles)(target, key, descriptor);
    }

    return descriptor;
  };
};
