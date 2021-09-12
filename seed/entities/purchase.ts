import { Fake } from '../common/fake.generic';
import { lift } from '../common/lift-to-entity';
import { PurchaseEntity } from '../../src/modules/commerce/infrastructure/entities/purchase.entity';
import * as _ from 'faker';
import { types, Session } from 'neo4j-driver';

export const fakePurchase: Fake<PurchaseEntity> = ({
  ticketId,
  userId,
}: {
  ticketId: string;
  userId: string;
}) => {
  return lift({
    ticketId,
    amountOfTickets: _.datatype.number(),
    userId,
    executedAt: types.DateTime.fromStandardDate(_.date.past()),
    status: 'done',
    transactionId: _.datatype.uuid(),
    gateway: 'enzona',
  });
};

export const savePurchase = (session: Session) => async (e: PurchaseEntity) => {
  const query = `MATCH (t:Ticket), (u:User)
								WHERE t.id = $tId AND u.id = $uId
								CREATE (t)<-[:TO_TICKET]-(p:Purchase)<-[:MADE_PURCHASE]-(u)
								SET p += $data`;

  await session.writeTransaction((tx) => {
    const { ticketId, userId, ...data } = e;
    tx.run(query, { uId: userId, tId: ticketId, data });
  });
  console.log(`Created purchase ${e.transactionId}`);
};
