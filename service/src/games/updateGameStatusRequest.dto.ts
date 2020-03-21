import { IsEnum } from 'class-validator';
import { GameStatus } from './gameStatus.model';

class UpdateGameStatusRequest {
  @IsEnum(GameStatus)
  status: GameStatus;
}

export default UpdateGameStatusRequest;
