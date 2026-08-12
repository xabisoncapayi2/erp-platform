import { PartialType } from '@nestjs/mapped-types';
import { CreatePODto } from './create-po.dto';

export class UpdatePurchaseOrderDto extends PartialType(CreatePODto) {}
