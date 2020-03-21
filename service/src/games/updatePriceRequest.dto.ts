import { IsInt, Min } from 'class-validator';

class UpdatePriceRequest {
  @IsInt()
  @Min(0)
  price: number;
}

export default UpdatePriceRequest;
