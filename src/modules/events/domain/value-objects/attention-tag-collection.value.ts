import { WatchedList } from 'src/shared/core/WatchedList';
import { AttentionTagRef } from '../entities/attention-tag.entity';

export class AttentionTagRefCollection extends WatchedList<AttentionTagRef> {
  compareItems(a: AttentionTagRef, b: AttentionTagRef): boolean {
    return a.equals(b);
  }
}
