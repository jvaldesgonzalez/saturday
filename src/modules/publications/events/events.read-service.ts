import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { Integer } from 'neo4j-driver-core';
import { CreateNotification } from 'src/modules/notifications/application/use-cases/createNotification/create-notification.usecase';
import { NotificationType } from 'src/modules/notifications/enums/notification-type';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { makeDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
import { EventDetails } from './presentation/event-details';
import { EventDetailsReadMapper } from './read-model/mappers/event-details.read-mapper';

@Injectable()
export class EventsReadService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
    private notify: CreateNotification,
  ) {}

  async getEventDetails(
    eventId: string,
    userId: string,
  ): Promise<EventDetails> {
    return (
      (await this.persistenceManager.maybeGetOne<EventDetails>(
        QuerySpecification.withStatement(
          `
				MATCH (pl:Place)<-[:HAS_PLACE]-(e:Event)<-[:PUBLISH_EVENT]-(p:Partner),
				(e)-[:HAS_CATEGORY]->(cat:Category)
				WHERE e.id = $eId OR e.slug = $eId
				OPTIONAL MATCH (e)-[:HAS_OCCURRENCE]->(o:EventOccurrence)-[:HAS_TICKET]->(t:Ticket)
				WHERE o.dateTimeEnd > $now
				OPTIONAL MATCH (e)-[:HAS_TAG]-(tag:AttentionTag)
				OPTIONAL MATCH (e)<-[:COLLABORATOR]-(c:Partner)
				MATCH (me:User)
				WHERE me.id = $meId
				OPTIONAL MATCH (me)-[rfollow:FOLLOW]->(p)
				OPTIONAL MATCH (me)-[rlike:LIKE]-(e)
				OPTIONAL MATCH (u:User)-[:LIKE]->(e)
				WITH {
					id:o.id,
					dateTimeInit:o.dateTimeInit,
					dateTimeEnd:o.dateTimeEnd,
					tickets:collect(distinct t { .id, .price, .name, .amount, .description})
				} as occ , e, collect(distinct tag { .title, .color, .description}) as tags, p, pl, cat, collect(distinct c {.id,.avatar,.username}) as coll,count(distinct u) as usersInterested, rlike,rfollow,me ORDER BY occ.dateTimeInit
				with distinct {
					id:e.id,
					name:e.name,
					occurrences:collect(occ),
					info:e.description,
					publisher:{
						id:p.id,
						avatar:p.avatar,
						username:p.username,
						businessName:p.businessName,
						IFollowThis: rfollow IS NOT null
					},
					category:{
						name:cat.name,
						id:cat.id
					},
					place:{
						name:pl.name,
						address:pl.address,
						longitude:(pl.longitude),
						latitude:(pl.latitude)
					},
					collaborators: coll,
					multimedia:e.multimedia,
					attentionTags: tags,
					amIInterested: rlike IS NOT null,
					totalUsersInterested: usersInterested,
					dateTimeInit:e.dateTimeInit,
					dateTimeEnd:e.dateTimeEnd,
					basePrice:e.basePrice,
					slug:e.slug
				} as eventInfo, me, e
				CALL {
					WITH e,me
					OPTIONAL MATCH (me)-[:FRIEND]-(f:User)-[:LIKE]->(e)
					RETURN f limit 3
				}
				return apoc.map.merge(eventInfo, {friends:collect( distinct f{.username, .avatar})})
				`,
        )
          .bind({ eId: eventId, meId: userId, now: makeDate(new Date()) })
          .map(EventDetailsReadMapper.toResponse)
          .transform(EventDetails),
      )) ?? null
    );
  }

  async getEventsByPartner(
    partnerId: string,
    userId: string,
    skip: number,
    limit: number,
  ): Promise<PaginatedFindResult<EventDetails>> {
    const [items, total] = await Promise.all([
      this.persistenceManager.query<EventDetails>(
        QuerySpecification.withStatement(
          `
				MATCH (pl:Place)<-[:HAS_PLACE]-(e:Event)<-[:PUBLISH_EVENT]-(p:Partner),
				(e)-[:HAS_CATEGORY]->(cat:Category)
				WHERE p.id = $pId
				OPTIONAL MATCH (e)-[:HAS_TAG]-(tag:AttentionTag)
				OPTIONAL MATCH (e)<-[:COLLABORATOR]-(c:Partner)
				MATCH (me:User)
				WHERE me.id = $meId
				OPTIONAL MATCH (me)-[rfollow:FOLLOW]->(p)
				OPTIONAL MATCH (me)-[rlike:LIKE]-(e)
				OPTIONAL MATCH (u:User)-[:LIKE]->(e)
				WITH e, collect(distinct tag { .title, .color, .description}) as tags, p, pl, cat, collect(distinct c {.id,.avatar,.username}) as coll,count(distinct u) as usersInterested, rlike,rfollow,me
				with distinct {
					id:e.id,
					name:e.name,
					occurrences:[],
					info:e.description,
					publisher:{
						id:p.id,
						avatar:p.avatar,
						username:p.username,
						businessName:p.businessName,
						IFollowThis: rfollow IS NOT null
					},
					category:{
						name:cat.name,
						id:cat.id
					},
					place:{
						name:pl.name,
						address:pl.address,
						longitude:(pl.longitude),
						latitude:(pl.latitude)
					},
					collaborators: coll,
					multimedia:e.multimedia,
					attentionTags: tags,
					amIInterested: rlike IS NOT null,
					createdAt:e.createdAt,
					totalUsersInterested: usersInterested,
					dateTimeInit:e.dateTimeInit,
					dateTimeEnd:e.dateTimeEnd,
					basePrice:e.basePrice,
					slug:e.slug
				} as eventInfo, me, e
				CALL {
					WITH e,me
					OPTIONAL MATCH (me)-[:FRIEND]-(f:User)-[:LIKE]->(e)
					RETURN f limit 3
				}
				WITH apoc.map.merge(eventInfo, {friends:collect( distinct f{.username, .avatar})}) as events 
				RETURN events ORDER BY events.createdAt DESC
				SKIP $skip
				LIMIT $limit
				`,
        )
          .bind({
            pId: partnerId,
            meId: userId,
            skip: Integer.fromInt(skip),
            limit: Integer.fromInt(limit),
          })
          .map(EventDetailsReadMapper.toResponse)
          .transform(EventDetails),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
					MATCH (e:Event)<-[:PUBLISH_EVENT]-(p:Partner)
					WHERE p.id = $pId
					RETURN count(e)
					`,
        ).bind({ pId: partnerId }),
      ),
    ]);

    return {
      items,
      total,
      pageSize: items.length,
      current: skip,
    };
  }

  async getEventsWithHashtag(
    hashtagWord: string,
    skip: number,
    limit: number,
    userId: string,
  ): Promise<PaginatedFindResult<EventDetails>> {
    const sanitizedWord = TextUtils.removeLeadingSharpCharacter(
      hashtagWord.trim(),
    );
    const [items, total] = await Promise.all([
      this.persistenceManager.query<EventDetails>(
        QuerySpecification.withStatement(
          `
					MATCH (e:Event)-[:CONTAIN_HASHTAG]->(h:Hashtag)
					WHERE h.word = $hashtagWord
					MATCH (pl:Place)<-[:HAS_PLACE]-(e)<-[:PUBLISH_EVENT]-(p:Partner),
					(e)-[:HAS_CATEGORY]->(cat:Category)

					OPTIONAL MATCH (e)-[:HAS_TAG]-(tag:AttentionTag)
					OPTIONAL MATCH (e)<-[:COLLABORATOR]-(c:Partner)

					MATCH (me:User)
					WHERE me.id = $meId
					OPTIONAL MATCH (me)-[rfollow:FOLLOW]->(p)
					OPTIONAL MATCH (me)-[rlike:LIKE]-(e)
					OPTIONAL MATCH (u:User)-[:LIKE]->(e)

					WITH e, collect(distinct tag { .title, .color, .description}) as tags, p, pl, cat, collect(distinct c {.id,.avatar,.username}) as coll,count(distinct u) as usersInterested, rlike,rfollow,me
					with distinct {
						id:e.id,
						name:e.name,
						occurrences:[],
						info:e.description,
						publisher:{
							id:p.id,
							avatar:p.avatar,
							username:p.username,
							businessName:p.businessName,
							IFollowThis: rfollow IS NOT null
						},
						category:{
							name:cat.name,
							id:cat.id
						},
						place:{
							name:pl.name,
							address:pl.address,
							longitude:(pl.longitude),
							latitude:(pl.latitude)
						},
						collaborators: coll,
						multimedia:e.multimedia,
						attentionTags: tags,
						amIInterested: rlike IS NOT null,
						totalUsersInterested: usersInterested,
						dateTimeInit: e.dateTimeInit,
						createdAt:e.createdAt,
						dateTimeEnd: e.dateTimeEnd,
						basePrice: e.basePrice,
						slug:e.slug
					} as eventInfo, me, e
					call {
						WITH e,me
						OPTIONAL MATCH (me)-[:FRIEND]-(f:User)-[:LIKE]->(e)
						RETURN f LIMIT 3
          }
					WITH collect(f) as friends,f, eventInfo
					return apoc.map.merge(eventInfo, {friends:collect( distinct f{.username, .avatar})}) as result
					ORDER BY result.createdAt DESC
					SKIP $skip
					LIMIT $limit
					`,
        )
          .bind({
            hashtagWord: sanitizedWord,
            skip: Integer.fromInt(skip),
            limit: Integer.fromInt(limit),
            meId: userId,
          })
          .map(EventDetailsReadMapper.toResponse)
          .transform(EventDetails),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
					MATCH (e:Event)-[:CONTAIN_HASHTAG]->(h:Hashtag)
					WHERE h.word = $hashtagWord
					return count(e)
					`,
        ).bind({ hashtagWord: sanitizedWord }),
      ),
    ]);
    return {
      items,
      total,
      pageSize: items.length,
      current: skip,
    };
  }

  async cancelOccurrence(theOccurrenceId: string): Promise<{
    eventId: string;
    closedTickets: { userId: string; ticketId: string }[];
  }> {
    const ret = await this.persistenceManager.getOne<{
      eventId: string;
      closedTickets: { userId: string; ticketId: string }[];
    }>(
      QuerySpecification.withStatement(
        `
					match (e:Event)--(o:EventOccurrence)--(t:Ticket)--(r:Reservation)--(u:User)
					where o.id = $oId
					set t.amount = 0
					set r.cancelled = true
					return {
						eventId:e.id,
						closedTickets:collect({ticketId:t.id,userId:u.id})
					}
				`,
      ).bind({ oId: theOccurrenceId }),
    );
    this.notifyBuyers(
      [...new Set(ret.closedTickets.map((t) => t.ticketId))],
      ret.eventId,
    );
    return ret;
  }

  async notifyBuyers(theTicketsId: string[], eventId: string): Promise<void> {
    const notificationData = await this.persistenceManager.query<{
      recipient: string;
      reservationId: string;
      publisher: string;
    }>(
      QuerySpecification.withStatement(
        `
					MATCH (p:Partner)--(e:Event)--(o:EventOccurrence)--(t:Ticket)--(r:Reservation)--(buyer:User)
					WHERE t.id IN $ticketsId
					RETURN {
						recipient:buyer.id,
						publisher:p.id,
						reservationId: r.id
					}
			`,
      ).bind({ ticketsId: theTicketsId }),
    );
    for (const data of notificationData) {
      this.notify.execute({
        recipientId: [data.recipient],
        eventId: eventId,
        userId: data.publisher,
        reservationId: data.reservationId,
        type: NotificationType.EventCancelled,
      });
    }
  }
}
