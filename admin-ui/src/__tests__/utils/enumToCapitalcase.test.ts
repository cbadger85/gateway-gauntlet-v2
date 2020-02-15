import { enumToCapitalcase } from '../../utils/enumToCapitalcase';

describe('enumToCapitalcase', () => {
  it('should turn a string of varying capitalization and return a capitalized string', () => {
    const word = enumToCapitalcase('WoRD');

    expect(word).toBe('Word');
  });

  it('should replace underscores with spaces', () => {
    const word = enumToCapitalcase('BETTER_WORD');

    expect(word).toBe('Better Word');
  });
});
