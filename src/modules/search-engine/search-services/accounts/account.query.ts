import { Query } from '../../common/search-query.abstract';

export class AccountQuery extends Query {
  get processedQuery(): string {
    return this.makeUsernameQuery() + ' OR ' + this.makeNameQuery();
  }

  private makeUsernameQuery() {
    const terms = this.raw.trim().split(' ');
    const sum = terms.join('');
    const sumAsPrefix = `${sum}*`;
    const sumAsSubstring = `*${sumAsPrefix}`;
    const sumFuzzy = `${sum}~1`;
    const termsFuzzy = terms
      .map((t) => (t.length > 3 ? `${t}~1` : t))
      .filter((i) => i);

    return `username: ${
      sum.length > 4 ? sumAsSubstring : sumAsPrefix
    }^3 OR username: ${sumFuzzy}^3 OR username: ${termsFuzzy.join(
      ' OR username: ',
    )}`;
  }

  private makeNameQuery() {
    const termsFuzzy = this.raw
      .trim()
      .split(' ')
      .map((t) => `${t}~2 OR ${t}*`)
      .filter((i) => i);
    return `fullname: ${termsFuzzy.join(
      ' OR fullname: ',
    )} OR businessName: ${termsFuzzy.join(' OR fullname:')}`;
  }
}
