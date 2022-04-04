import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class ReservationEntity extends PersistentEntity {
  ticketId: string;
  couponId?: string;
  amountOfTickets: number;
  issuerId: string;
  securityPhrase: string;
  isValidated: boolean;
  ticketName: string;
  ticketDescription: string;
  ticketPrice: number;
}
