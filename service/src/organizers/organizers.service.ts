import { Service } from 'typedi';
import UserRepository from '../users/users.repository';
import { getEmojiLog } from '../utils/getEmojiLog';

@Service()
class OrganizerService {
  constructor(private userRepository: UserRepository) {}

  getOrganizers = async (): Promise<{ id: string; name: string }[]> => {
    console.log(getEmojiLog('👤👤👤', 'Retrieving organizers list...'));
    return (await this.userRepository.findOrganizers()).map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
    }));
  };
}

export default OrganizerService;
