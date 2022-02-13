import { TextUtils } from 'src/shared/utils/text.utils';
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
    if (s.length === 0) return '';
    return `word: ${s}~0.7 OR word: ${s}*`;
  }

  private removeSharpCharacter(s: string) {
    return TextUtils.removeLeadingSharpCharacter(s);
  }
}
