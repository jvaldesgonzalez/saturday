import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Payment } from '../../domain/payment.domain';

export interface TicketWithMetadata {
  name: string;
  description: string;
  price: number;
  eventName: string;
}

export interface IPaymentsRepository extends IRepository<Payment> {
  getTicketMetadata(theTicketId: UniqueEntityID): Promise<TicketWithMetadata>;
  fetchAvailability(
    theTicketId: UniqueEntityID,
    amount: number,
  ): Promise<boolean>;
  getById(thePaymentId: UniqueEntityID): Promise<Payment>;
}
