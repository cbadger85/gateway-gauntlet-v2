import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

class AddPlayerRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  itsName: string;

  @IsString()
  @Length(4, 8)
  itsPin: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(24)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  city: string;

  @IsString()
  @Length(2, 2)
  state: string;

  @IsOptional()
  @IsBoolean()
  paid: boolean;

  @IsOptional()
  @IsBoolean()
  attending?: boolean;
}

export default AddPlayerRequest;
