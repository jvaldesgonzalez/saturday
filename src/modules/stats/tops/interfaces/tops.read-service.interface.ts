import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { EventReadEntity } from '../entities/event.entity';

export interface ITopsService {
  getTopCheap(
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<EventReadEntity>>;
  getTopSellers(
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<EventReadEntity>>;
}
