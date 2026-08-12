import { IsArray, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ReceivePOLineDto {
  @IsString()
  @IsNotEmpty()
  poLineId: string;

  @IsInt()
  @Min(1)
  quantityReceived: number;
}

export class ReceivePODto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceivePOLineDto)
  items: ReceivePOLineDto[];
}
