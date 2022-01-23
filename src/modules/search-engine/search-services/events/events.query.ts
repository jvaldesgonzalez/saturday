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
      .map((t) => (t.length > 3 ? `${t}~^2 OR name:${t}*^2` : `${t}*^2`))
      .filter((i) => i);
    return `name: ${termsFuzzy.join(' OR name:')}`;
  }
}
