import { IsNotEmpty, IsUUID, IsArray, MaxLength } from 'class-validator';

class CreateGameRequest {
  @IsNotEmpty()
  @MaxLength(24)
  name: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  organizerIds: string[];
}

export default CreateGameRequest;
