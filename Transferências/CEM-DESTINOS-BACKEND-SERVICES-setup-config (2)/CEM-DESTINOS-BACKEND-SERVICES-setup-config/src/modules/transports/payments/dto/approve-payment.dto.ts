import { IsOptional, IsUrl } from 'class-validator';

export class ApprovePaymentDto {
  @IsOptional()
  @IsUrl()
  file_url?: string;
}
