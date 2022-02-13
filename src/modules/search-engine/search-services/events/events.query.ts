import { Query } from '../../common/search-query.abstract';

export class EventQuery extends Query {
  get processedQuery(): string {
    return this.makeDescriptionQuery() + ' OR ' + this.makeNameQuery();
  }

  private makeDescriptionQuery() {
    return `description: ${this.raw.trim()}`;
  }

  private makeNameQuery() {
    const termsFuzzy = this.raw
      .trim()
      .split(' ')
      .map((t) => `${t}*^2`)
      .filter((i) => i);
    return `name: ${termsFuzzy.join(' OR name:')} OR name: ${
      this.raw.length > 4 ? +this.raw + '~1' : this.raw
    }`;
  }
}
