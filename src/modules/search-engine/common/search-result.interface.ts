import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';

export interface ISearchResultItem<TItem> {
  data: TItem;
  score: number;
}

export interface ISearchResult<T>
  extends PaginatedFindResult<ISearchResultItem<T>> {}
