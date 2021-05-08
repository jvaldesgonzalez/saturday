import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class TicketEntity extends PersistentEntity {
  price: number;
  name: string;
  amount: number;
  description: number;
}
