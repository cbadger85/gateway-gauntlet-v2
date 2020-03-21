import { formatMissions, formatDate } from '../../components/TournamentTable';
import { parse } from 'date-fns';

describe('TournamentTable', () => {
  describe('formatMissions', () => {
    it('should take an array of missions and add a comma between them', () => {
      const missions = ['mission 1', 'mission 2'];

      const missionsWithComma = formatMissions(missions);

      expect(missionsWithComma).toBe('mission 1, mission 2');
    });
  });

  describe('formatDate', () => {
    it('should return just one date if length is 1', () => {
      const date = formatDate(parse('2/20/20', 'M/d/yy', new Date()), 1);

      expect(date).toBe('Feb 20th, 2020');
    });

    it('should return a range of dates if length is greater than 1', () => {
      const date = formatDate(parse('2/20/20', 'M/d/yy', new Date()), 2);

      expect(date).toBe('Feb 20th - 21st, 2020');
    });

    it('should show both months if the range is spread over two months', () => {
      const date = formatDate(parse('1/31/20', 'M/d/yy', new Date()), 2);

      expect(date).toBe('Jan 31st - Feb 1st, 2020');
    });
  });
});
