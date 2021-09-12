import { Fake } from '../common/fake.generic';
import { lift } from '../common/lift-to-entity';
import { TicketEntity } from '../../src/modules/events/infrastruture/entities/ticket.entity';
import * as _ from 'faker';

export const fakeTicket: Fake<TicketEntity> = () => {
  return lift({
    price: parseFloat(_.commerce.price()),
    name: _.name.title(),
    amount: _.datatype.number(),
    description: _.lorem.sentence(),
  });
};
