import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsDateString,
} from 'class-validator';

export class CreateTicketDto {
  @IsInt()
  @IsNotEmpty()
  passenger_id: number;

  @IsInt()        
  @IsNotEmpty()   
  seat_id: number;

  @IsInt()
  @IsNotEmpty()
  schedule_id: number;

  @IsOptional()
  @IsInt()
  payment_id?: number;

  @IsOptional()
  @IsIn(['incomplete', 'pending', 'approved', 'rejected', 'expired'])
  status?: string;

  @IsOptional()
  @IsDateString()
  confirmed_at?: string;

  @IsOptional()
  @IsDateString()
  expires_at?: string;
}
