import {
  IsNumber,
  IsNotEmpty,
  Min,
  IsString,
  IsOptional,
  IsIn,
  IsDateString,
  IsUrl,
} from 'class-validator';

export class CreatePaymentDto {
  @IsOptional()
  @IsString()
  company_service_type?: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  payment_method?: string;

  @IsOptional()
  @IsDateString()
  payment_date?: string;

  @IsOptional()
  @IsUrl()
  file_url?: string;

  @IsOptional()
  @IsString()
  reference_code?: string;

  @IsOptional()
  @IsIn(['pending', 'completed', 'failed', 'refunded'])
  status?: string;
}
