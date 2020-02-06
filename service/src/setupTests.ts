import { createConnection, getConnection } from 'typeorm';
import Game from './games/games.entity';
import Player from './players/players.entity';
import User from './users/entities/users.entity';
import 'sqlite3';

beforeEach(() => {
  return createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [User, Game, Player],
    synchronize: true,
    logging: false,
  });
});

afterEach(() => {
  const conn = getConnection();
  return conn.close();
});
