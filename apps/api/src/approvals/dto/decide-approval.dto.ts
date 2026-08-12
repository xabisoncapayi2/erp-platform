import { IsEnum, IsOptional, IsString } from 'class-validator';

export class DecideApprovalDto {
  @IsEnum(['APPROVED', 'REJECTED'])
  decision!: 'APPROVED' | 'REJECTED';

  @IsOptional()
  @IsString()
  decisionNote?: string;
}
