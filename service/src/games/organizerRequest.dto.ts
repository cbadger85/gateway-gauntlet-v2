import { IsNotEmpty, IsUUID } from 'class-validator';

class OrganizerRequest {
  @IsNotEmpty()
  @IsUUID()
  organizerId: string;
}

export default OrganizerRequest;
