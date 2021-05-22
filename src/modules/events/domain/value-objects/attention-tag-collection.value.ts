import { WatchedList } from 'src/shared/core/WatchedList';
import { AttentionTag } from '../entities/attention-tag.entity';

export class AttentionTagCollection extends WatchedList<AttentionTag> {
  compareItems(a: AttentionTag, b: AttentionTag): boolean {
    return a.equals(b);
  }
}
