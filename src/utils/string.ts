export function pluralizeWithS(word: string, quantity: number): string {
  return `${word}${quantity > 1 ? 's' : ''}`;
}
