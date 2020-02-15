import dotenv from 'dotenv';
import uuid from 'uuid/v4';
import { Role } from './auth/Role.model';
import dbSetup from './dbSetup';
import User from './users/users.entity';
import bcrypt from 'bcryptjs';
import { getEmojiLog } from './utils/getEmojiLog';

export const bootstrap = async (): Promise<void> => {
  console.log('Bootstraping admin user...');
  dotenv.config();

  if (
    !process.env.ADMIN_EMAIL ||
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_PASSWORD ||
    !process.env.ADMIN_FIRST_NAME ||
    !process.env.ADMIN_LAST_NAME
  ) {
    console.log('No user info found...');
    return;
  }

  const connection = await dbSetup();
  const repository = connection.getRepository(User);

  const [, exists] = await repository.findAndCount({
    where: [
      { username: process.env.ADMIN_USERNAME },
      { email: process.env.ADMIN_EMAIL },
    ],
  });

  if (exists) {
    console.log('User already exists... Exiting bootstrap...');
    await connection.close();
    console.log(getEmojiLog('⬇️', 'Connection closed'));
    return;
  }

  const user = new User();
  user.email = process.env.ADMIN_EMAIL;
  user.username = process.env.ADMIN_USERNAME;
  user.firstName = process.env.ADMIN_FIRST_NAME;
  user.lastName = process.env.ADMIN_LAST_NAME;
  user.password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  user.roles = [Role.SUPER_ADMIN];
  user.sessionId = uuid();

  await repository.save(user);

  await connection.close();
  console.log('Admin User bootstrapped!');
  console.log(getEmojiLog('⬇️', 'Connection closed'));
};

bootstrap().catch(e => {
  console.error(e);
});
