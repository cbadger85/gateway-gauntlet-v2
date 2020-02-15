import { IsNotEmpty } from 'class-validator';

class RequestResetPasswordRequest {
  @IsNotEmpty()
  email: string;
}

export default RequestResetPasswordRequest;
