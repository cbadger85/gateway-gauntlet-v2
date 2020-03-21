import {
  IsNotEmpty,
  IsUUID,
  IsArray,
  MaxLength,
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateGameRequest {
  @IsNotEmpty()
  @MaxLength(24)
  name: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  organizerIds: string[];

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsInt()
  @IsPositive()
  length?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @IsArray()
  @IsNotEmpty({ each: true })
  missions: string[];
}

export default CreateGameRequest;
