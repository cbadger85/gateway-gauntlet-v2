import dotenv from 'dotenv';
import 'reflect-metadata';
import dbSetup from './dbSetup';
import server from './server';
import { getEmojiLog } from './utils/getEmojiLog';

export default (async function Main() {
  console.log(getEmojiLog('🔗', 'Initializing app...'));
  dotenv.config();

  await dbSetup();

  const app = await server();

  const port = process.env.PORT || 4444;
  app.listen(port, () => {
    console.log(getEmojiLog('👂', `App is listening on port: ${port}`));
  });
})().catch(e => {
  console.log(getEmojiLog('🙀', 'app failed...'));
  console.error(e);
});
