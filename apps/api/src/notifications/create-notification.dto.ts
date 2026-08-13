import { IsString, IsOptional, IsObject } from "class-validator";

export class CreateNotificationDto {
  @IsString()
  tenantId: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
