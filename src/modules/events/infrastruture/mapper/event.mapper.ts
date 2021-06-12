import { Fail, Join, Ok, Result } from 'src/shared/core/Result';
import { Multimedia, MultimediaType } from 'src/shared/domain/multimedia.value';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { CategoryRef } from '../../domain/entities/categoryRef.entity';
import { EventOccurrence } from '../../domain/entities/event-ocurrency.entity';
import { Event } from '../../domain/entities/event.entity';
import { EventRef } from '../../domain/entities/eventRef.entity';
import { PublisherRef } from '../../domain/entities/publisherRef.entity';
import { Ticket, TicketCollection } from '../../domain/entities/ticket.entity';
import { EventName } from '../../domain/value-objects/event-name.value';
import { EventPlace } from '../../domain/value-objects/event-place.value';
import { TicketAmount } from '../../domain/value-objects/ticket-amount.value';
import { TicketPrice } from '../../domain/value-objects/ticket-price.value';
import { UnknownField } from '../../domain/value-objects/unknown-field.value';
import { EventOccurrenceEntity } from '../entities/event-occurrence.entity';
import {
  EventEntity,
  MultimediaPersistent,
  UnknownFieldPersistent,
} from '../entities/event.entity';

export class EventMapper {
  private static createOccurrencesFromRaw(
    raw: EventOccurrenceEntity,
  ): Result<EventOccurrence> {
    const ticketsOrError = Join(
      raw.tickets.map((tkt) => {
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

    if (ticketsOrError.isFailure)
      return Fail<EventOccurrence>(ticketsOrError.error.toString());

    return EventOccurrence.create(
      {
        ...raw,
        eventId: EventRef.create(raw.eventId).getValue(),
        dateTimeInit: new Date(raw.dateTimeInit),
        dateTimeEnd: new Date(raw.dateTimeEnd),
        createdAt: new Date(raw.createdAt),
        updatedAt: new Date(raw.updatedAt),
        tickets: new TicketCollection(ticketsOrError.getValue()),
      },
      new UniqueEntityID(raw.id),
    );
  }

  public static PersistentToDomain(p: EventEntity): Event {
    const publisherOrError = PublisherRef.create(p.publisher);
    const nameOrError = EventName.create(p.name);
    const unknownFieldsOrError: Result<UnknownField[]> = Join(
      JSON.parse(p.description).map((uf: UnknownFieldPersistent) =>
        UnknownField.create(uf),
      ),
    );
    const categoriesOrError = Join(
      p.categories.map((ct) => CategoryRef.create(ct)),
    );
    const placeOrError = p.place
      ? EventPlace.create({
          ...p.place,
          hostRef: p.place.hostRef ? new UniqueEntityID(p.place.hostRef) : null,
        })
      : Ok(undefined);
    const collaboratorsOrError = Join(
      p.collaborators.map((col) => PublisherRef.create(col)),
    );
    const multimediasOrError: Result<Multimedia[]> = Join(
      JSON.parse(p.multimedia).map((mtm: MultimediaPersistent) =>
        Multimedia.create({ type: mtm.type as MultimediaType, url: mtm.url }),
      ),
    );

    return Event.create(
      {
        publisher: publisherOrError.getValue(),
        name: nameOrError.getValue(),
        description: unknownFieldsOrError.getValue(),
        categories: categoriesOrError.getValue(),
        place: placeOrError.getValue(),
        collaborators: collaboratorsOrError.getValue(),
        multimedia: multimediasOrError.getValue(),
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      },
      new UniqueEntityID(p.id),
    ).getValue();
  }

  public static DomainToPersistence(d: Event): EventEntity {
    return {
      id: d._id.toString(),
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
      publisher: d.publisher._id.toString(),
      name: d.name.value,
      description: JSON.stringify(
        d.description.map((uf) => {
          return {
            header: uf.header,
            body: uf.body,
            inline: uf.isInline,
          };
        }),
      ),
      categories: d.categories.map((ct) => ct.id.toString()),
      place: d.place
        ? {
            name: d.place.name,
            address: d.place.address,
            longitude: d.place.longitude,
            latitude: d.place.latitude,
            hostRef: d.place.hostRef ? d.place.hostRef.toString() : null,
          }
        : null,
      collaborators: d.collaborators.map((cb) => cb._id.toString()),
      multimedia: JSON.stringify(
        d.multimedia.map((mtm) => {
          return {
            type: mtm.type,
            url: mtm.url,
          };
        }),
      ),
      attentionTags: d.attentionTags
        .getItems()
        .map((tagId) => tagId._id.toString()),
    };
  }
}
