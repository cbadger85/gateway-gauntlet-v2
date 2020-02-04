import { useLocation } from 'react-router-dom';
import { useQuery } from '../../hooks/useQuery';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn().mockReturnValue({
    search: 'url',
  }),
}));

describe('useQuery', () => {
  it('should return an instance of URLSearchParams', () => {
    const query = useQuery();

    expect(query).toBeInstanceOf(URLSearchParams);
  });
});
