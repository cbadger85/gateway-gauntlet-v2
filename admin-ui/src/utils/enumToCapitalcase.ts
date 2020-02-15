export const enumToCapitalcase = (string: string): string =>
  string
    .split('_')
    .map(word =>
      word
        .split('')
        .map((letter, i) =>
          i === 0 ? letter.toUpperCase() : letter.toLowerCase(),
        )
        .join(''),
    )
    .join(' ');
