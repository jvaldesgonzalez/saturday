import { DateTime } from 'neo4j-driver';
import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class PurchaseEntity extends PersistentEntity {
  ticketId: string;
  amountOfTickets: number;
  executedAt: DateTime<number>;
  userId: string;
  status: 'pending' | 'failed' | 'done';
  transactionId: string;
  gateway: 'enzona';
}
