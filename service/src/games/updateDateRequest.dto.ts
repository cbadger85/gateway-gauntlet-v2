import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsPositive } from 'class-validator';

class UpdateDateRequest {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsInt()
  @IsPositive()
  length?: number;
}

export default UpdateDateRequest;
