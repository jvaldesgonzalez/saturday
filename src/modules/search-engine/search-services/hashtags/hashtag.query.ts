import { Query } from '../../common/search-query.abstract';

export class HashtagQuery extends Query {
  get processedQuery(): string {
    return this.raw.split(' ').map(this.fuzzyOrPrefix).join(' OR ');
  }

  private fuzzyOrPrefix(s: string): string {
    return `word: ${s}~ OR ${s}*`;
  }
}
