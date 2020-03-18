import {
  IsNotEmpty,
  IsUUID,
  IsArray,
  MaxLength,
  IsDate,
  IsInt,
  IsOptional,
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
  length?: number;

  @IsOptional()
  @IsInt()
  price?: number;

  @IsArray()
  @IsNotEmpty({ each: true })
  missions: string[];
}

export default CreateGameRequest;
