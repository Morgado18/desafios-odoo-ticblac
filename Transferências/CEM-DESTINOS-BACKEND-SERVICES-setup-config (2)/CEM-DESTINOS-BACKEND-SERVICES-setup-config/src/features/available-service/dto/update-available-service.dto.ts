import { PartialType } from '@nestjs/mapped-types';
import { CreateAvailableServiceDto } from './create-available-service.dto';

export class UpdateAvailableServiceDto extends PartialType(CreateAvailableServiceDto) {}
