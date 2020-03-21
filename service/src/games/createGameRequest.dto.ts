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
  IsString,
  ArrayNotEmpty,
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
  @IsString({ each: true })
  @IsString({ each: true })
  @ArrayNotEmpty()
  missions: string[];
}

export default CreateGameRequest;
