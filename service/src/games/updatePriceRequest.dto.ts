import { IsInt } from 'class-validator';

class UpdatePriceRequest {
  @IsInt()
  price: number;
}

export default UpdatePriceRequest;
