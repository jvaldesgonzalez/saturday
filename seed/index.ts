import { fakeAttTag, saveAttTag } from './entities/attention-tag';
import { fakeCategory, saveCategory } from './entities/category';
import { fakeCollection, saveCollection } from './entities/collection';
import { fakeEvent, saveEvent } from './entities/event';
import { fakeHashtag, saveHashtag } from './entities/hashtag';
import { fakeLocation, saveLocation } from './entities/location';
import { fakeOccurrence, saveOccurrence } from './entities/occurrence';
import { fakePartner, savePartner } from './entities/partner';
import { fakePlace } from './entities/place';
import { fakePurchase, savePurchase } from './entities/purchase';
import { fakeTicket } from './entities/ticket';
import { fakeUser, saveUser } from './entities/user';
import { helpers as _ } from 'faker';

export const main = async () => {
  const neo4j = require('neo4j-driver');

  const uri = 'neo4j+s://1e04a1f5.databases.neo4j.io';
  const user = 'neo4j';
  const password = 'x9C5n2S2B_KN8ZItfcbevLIZAQfrOcPKWp_zz0e5cq4';

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const session = driver.session();

  // creating locations
  const locations = Array(3)
    .fill(null)
    .map(() => fakeLocation({}));
  for (const loc of locations) await saveLocation(session)(loc);

  // creating categories
  const categories = Array(10)
    .fill(null)
    .map(() => fakeCategory({}));
  for (const cat of categories) await saveCategory(session)(cat);

  //creating hashtags
  const hashtags = Array(7)
    .fill(null)
    .map(() => fakeHashtag({}));
  for (const ht of hashtags) await saveHashtag(session)(ht);

  //creating attention-tags
  const attTags = [
    fakeAttTag({ title: 'AGOTADO' }),
    fakeAttTag({ title: 'LA TIZA' }),
    fakeAttTag({ title: 'ORIGINAL' }),
  ];
  for (const tag in attTags) await saveAttTag(session)(attTags[tag]);

  //creating partners
  const partners = Array(20)
    .fill(null)
    .map(() => fakePartner({ locationId: _.randomize(locations).id }));
  for (const partner of partners) await savePartner(session)(partner);

  //creating users
  const users = Array(10)
    .fill(null)
    .map(() =>
      fakeUser({
        locationId: _.randomize(locations).id,
        categoryPreferences: [...categories]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.random() * 4 + 1)
          .map((c) => c.id),
      }),
    );
  for (const user of users) await saveUser(session)(user);

  //creating events
  const events = Array(80)
    .fill(null)
    .map(() =>
      fakeEvent({
        publisher: _.randomize(partners).id,
        categories: [...categories]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.random() * 3 + 1)
          .map((c) => c.id),
        collaborators: [...partners]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.random() < 0.85 ? 0 : 1)
          .map((c) => c.id),
        hashtags: [...hashtags]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.random() * 5)
          .map((c) => c.word),
        locationId: _.randomize(locations).id,
        attentionTags: [...attTags]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.random() < 0.85 ? 0 : 1)
          .map((c) => c.id),
      }),
    );
  for (const event of events) await saveEvent(session)(event);

  //creating collections
  const collections = Array(7)
    .fill(null)
    .map(() =>
      fakeCollection({
        publisher: _.randomize(partners).id,
        events: [...events]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.random() * 2 + 4)
          .map((c) => c.id),
      }),
    );
  for (const col of collections) await saveCollection(session)(col);

  const tickets = [];
  //creating occurrences
  for (const event of events) {
    const occTickets = Array(Math.random() < 0.75 ? 1 : 2)
      .fill(null)
      .map(() => fakeTicket({}));
    tickets.push(...occTickets);

    const occurrences = Array(Math.random() < 0.75 ? 1 : 2)
      .fill(null)
      .map(() =>
        fakeOccurrence({
          eventId: event.id,
          tickets: occTickets,
        }),
      );
    for (const occ of occurrences) await saveOccurrence(session)(occ);
  }

  //creating purchases
  // const purchases = Array(500).fil
};
