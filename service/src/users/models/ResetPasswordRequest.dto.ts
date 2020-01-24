import { IsNotEmpty, MinLength } from 'class-validator';

class ResetPasswordRequest {
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}

export default ResetPasswordRequest;
