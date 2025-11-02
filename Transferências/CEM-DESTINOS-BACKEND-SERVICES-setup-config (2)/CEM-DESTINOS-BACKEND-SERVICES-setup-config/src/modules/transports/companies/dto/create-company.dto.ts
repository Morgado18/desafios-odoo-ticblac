
import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsUUID()
  uuid: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  tax_id?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
