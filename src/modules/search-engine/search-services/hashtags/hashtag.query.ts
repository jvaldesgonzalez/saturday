import { Query } from '../../common/search-query.abstract';

export class HashtagQuery extends Query {
  get processedQuery(): string {
    return this.raw
      .trim()
      .split(' ')
      .filter((i) => i)
      .map((s) => s.trim())
      .map(this.removeSharpCharacter)
      .map(this.fuzzyOrPrefix)
      .join(' OR ');
  }

  private fuzzyOrPrefix(s: string): string {
    return `word: ${s}~ OR ${s}*`;
  }

  private removeSharpCharacter(s: string) {
    if (s[0] === '#') return s.slice(1);
    return s;
  }
}
