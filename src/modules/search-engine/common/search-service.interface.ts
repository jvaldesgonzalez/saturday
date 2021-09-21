import { Query } from './search-query.abstract';
import { ISearchResult } from './search-result.interface';

export interface ISearchService<TItem> {
  search(
    q: Query,
    skip: number,
    limit: number,
    requesterId?: string,
  ): Promise<ISearchResult<TItem>>;
}
