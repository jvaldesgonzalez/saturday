/**
 * Generic paginatedFind payload with pagination included.
 *
 * @export
 * @type PaginatedFindResult
 * @template T
 */
export class PaginatedFindResult<T> {
  items: T[];
  total: number;
  current: number;
  pageSize: number;
}

export const getDefaultPaginatedFindResult = <T>(): PaginatedFindResult<T> => {
  return {
    items: [],
    total: 0,
    current: 0,
    pageSize: 0,
  };
};
