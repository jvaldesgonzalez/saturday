import { Fail, Join, Result } from 'src/shared/core/Result';
import { Multimedia, MultimediaType } from 'src/shared/domain/multimedia.value';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { CategoryRef } from '../../domain/entities/categoryRef.entity';
import {
  EventOccurrence,
  EventOccurrenceCollection,
} from '../../domain/entities/event-ocurrency.entity';
import { Event } from '../../domain/entities/event.entity';
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
    const placeOrError = EventPlace.create({
      ...p.place,
      hostRef: p.place.hostRef ? new UniqueEntityID(p.place.hostRef) : null,
    });
    const collaboratorsOrError = Join(
      p.collaborators.map((col) => PublisherRef.create(col)),
    );
    const multimediasOrError: Result<Multimedia[]> = Join(
      JSON.parse(p.multimedia).map((mtm: MultimediaPersistent) =>
        Multimedia.create({ type: mtm.type as MultimediaType, url: mtm.url }),
      ),
    );
    const occurrencesOrError = Join(
      p.occurrences.map((occur) => EventMapper.createOccurrencesFromRaw(occur)),
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
        occurrences: new EventOccurrenceCollection(
          occurrencesOrError.getValue(),
        ),
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
      place: {
        name: d.place.name,
        address: d.place.address,
        longitude: d.place.longitude,
        latitude: d.place.latitude,
        hostRef: d.place.hostRef.toString(),
      },
      collaborators: d.collaborators.map((cb) => cb._id.toString()),
      multimedia: JSON.stringify(
        d.multimedia.map((mtm) => {
          return {
            type: mtm.type,
            url: mtm.url,
          };
        }),
      ),
      attentionTags: d.attentionTags.getItems().map((att) => {
        return {
          title: att.title,
          color: att.color,
          description: att.description,
          id: att._id.toString(),
        };
      }),
      occurrences: d.occurrences.getItems().map((occ) => {
        return {
          id: occ._id.toString(),
          createdAt: occ.createdAt.toISOString(),
          updatedAt: occ.updatedAt.toISOString(),
          dateTimeInit: occ.dateTimeInit.toISOString(),
          dateTimeEnd: occ.dateTimeEnd.toISOString(),
          tickets: occ.tickets.getItems().map((t) => {
            return {
              id: t._id.toString(),
              price: t.price.value,
              name: t.name,
              amount: t.amount.value,
              description: t.description,
              createdAt: t.createdAt.toISOString(),
              updatedAt: t.updatedAt.toISOString(),
            };
          }),
        };
      }),
    };
  }
}
