import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  Min,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateRouteDto {
  @IsInt()
  @IsNotEmpty()
  company_id: number;

  @IsInt()
  @IsNotEmpty()
  departure_id: number;

  @IsInt()
  @IsNotEmpty()
  arrival_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  duration_minutes: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  seats_total: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  seats_available: number;

  @IsOptional()
  @IsString()
  seat_pattern?: string;
}
