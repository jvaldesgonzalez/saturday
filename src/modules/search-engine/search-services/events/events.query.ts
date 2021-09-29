import { Query } from '../../common/search-query.abstract';

export class EventQuery extends Query {
  get processedQuery(): string {
    return this.makeDescriptionQuery() + ' OR ' + this.makeNameQuery();
  }

  private makeDescriptionQuery() {
    return `description: ${this.raw}`;
  }

  private makeNameQuery() {
    const termsFuzzy = this.raw
      .split(' ')
      .map((t) => (t.length > 3 ? `${t}~` : t))
      .filter((i) => i);
    return `name: ${termsFuzzy.join(' OR ')}`;
  }
}
