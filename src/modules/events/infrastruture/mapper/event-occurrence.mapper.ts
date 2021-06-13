import { Join, Result, Fail } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { EventOccurrence } from '../../domain/entities/event-ocurrency.entity';
import { EventRef } from '../../domain/entities/eventRef.entity';
import { Ticket, TicketCollection } from '../../domain/entities/ticket.entity';
import { TicketAmount } from '../../domain/value-objects/ticket-amount.value';
import { TicketPrice } from '../../domain/value-objects/ticket-price.value';
import { EventOccurrenceEntity } from '../entities/event-occurrence.entity';

export class EventOccurrenceMapper {
  public static PersistentToDomain(p: EventOccurrenceEntity): EventOccurrence {
    const ticketsOrError = Join(
      p.tickets.map((tkt) => {
        const amountOrError = TicketAmount.create(tkt.amount);
        const priceOrError = TicketPrice.create(tkt.price);

        const combined = Result.combine([amountOrError, priceOrError]);
        if (combined.isFailure) return Fail<Ticket>(combined.error);
        return Ticket.create(
          {
            ...tkt,
            createdAt: new Date(tkt.createdAt),
            updatedAt: new Date(tkt.updatedAt),
            amount: amountOrError.getValue(),
            price: priceOrError.getValue(),
          },
          new UniqueEntityID(tkt.id),
        );
      }),
    );

    return EventOccurrence.create(
      {
        ...p,
        eventId: EventRef.create(p.eventId).getValue(),
        dateTimeInit: new Date(p.dateTimeInit),
        dateTimeEnd: new Date(p.dateTimeEnd),
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        tickets: new TicketCollection(ticketsOrError.getValue()),
      },
      new UniqueEntityID(p.id),
    ).getValue();
  }

  public static DomainToPersistence(d: EventOccurrence): EventOccurrenceEntity {
    console.log('kkkkkkkkkkkkk');
    try {
      return {
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt.toISOString(),
        id: d._id.toString(),
        dateTimeInit: d.dateTimeInit.toISOString(),
        dateTimeEnd: d.dateTimeEnd.toISOString(),
        eventId: d.eventId._id.toString(),
        tickets: d.tickets.getItems().map((tkt) => {
          return {
            id: tkt._id.toString(),
            createdAt: tkt.createdAt.toISOString(),
            updatedAt: tkt.updatedAt.toISOString(),
            price: tkt.price.value,
            name: tkt.name,
            amount: tkt.amount.value,
            description: tkt.description,
          };
        }),
      };
    } catch (error) {
      console.log(error);
    }
  }
}
