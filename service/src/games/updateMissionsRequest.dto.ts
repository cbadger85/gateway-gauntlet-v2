import { IsArray, IsNotEmpty, IsString, ArrayNotEmpty } from 'class-validator';

class UpdateMissionsRequest {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @ArrayNotEmpty()
  missions: string[];
}

export default UpdateMissionsRequest;
