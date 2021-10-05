export class Query {
  protected raw: string;
  constructor(raw: string) {
    this.raw = raw;
  }

  get processedQuery(): string {
    return this.raw;
  }
}

export function GetCombinedProcessed(...queries: Query[]): Query {
  return new Query(queries.map((q) => q.processedQuery).join(' OR '));
}
