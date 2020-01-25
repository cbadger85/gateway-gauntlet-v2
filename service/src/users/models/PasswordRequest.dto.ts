import { IsNotEmpty, MinLength } from 'class-validator';

class PasswordRequest {
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}

export default PasswordRequest;
