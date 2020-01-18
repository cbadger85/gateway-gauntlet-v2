import { IsNotEmpty } from 'class-validator';

class LoginRequest {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export default LoginRequest;
