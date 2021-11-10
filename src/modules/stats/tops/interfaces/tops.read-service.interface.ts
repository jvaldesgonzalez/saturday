import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { EventEntity } from '../entities/event.entity';

export interface ITopsService {
  getTopCheap(
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<EventEntity>>;
  getTopSellers(
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<EventEntity>>;
}
