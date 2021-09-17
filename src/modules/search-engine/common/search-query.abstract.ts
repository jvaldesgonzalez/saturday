export abstract class Query {
  protected raw: string;
  constructor(raw: string) {
    this.raw = raw;
  }

  abstract get processedQuery(): string;
}
