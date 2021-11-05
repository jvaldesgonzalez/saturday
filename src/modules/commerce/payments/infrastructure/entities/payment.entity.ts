import { DateTime } from 'neo4j-driver';
import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class PaymentEntity extends PersistentEntity {
  ticketId: string;
  couponId?: string;
  amountOfTickets: number;
  gateway: string;
  executedAt?: DateTime<number>;
  status: string;
  issuerId: string;
  transactionUUID: string;
}
