import { SetMetadata } from '@nestjs/common';

export const IS_API_AVAILABLE = 'isApiAvailable';
export const ApiAvailable = () => SetMetadata(IS_API_AVAILABLE, true);
