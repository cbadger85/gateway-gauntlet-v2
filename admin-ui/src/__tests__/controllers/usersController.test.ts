import axios from '../../controllers/axios';
import { postResetPassword } from '../../controllers/usersController';

jest.mock('../../controllers/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('userController', () => {
  it('should call axios with the url and password', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: 'user' });

    const userId = 'aaa';
    const passwordResetId = 'bbb';
    const password = 'bar';
    await postResetPassword(userId, passwordResetId, password);

    const url = `${process.env.REACT_APP_BASE_URL}/users/${userId}/password/${passwordResetId}/reset`;

    expect(axios.post).toBeCalledWith(url, { password });
  });
});
