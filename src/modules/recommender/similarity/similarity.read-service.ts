import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { EventDetails } from 'src/modules/publications/events/presentation/event-details';
import { PaginatedFindResult } from 'src/shared/core/PaginatedFindResult';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
import { SimilarAccount } from './entities/account.entity';

@Injectable()
export class SimilarityReadService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getSimilarAccounts(
    accountId: string,
    skip: number,
    limit: number,
    threshold = 0.1, //FIXME: change threshold value, this is for testing purposes only
  ): Promise<PaginatedFindResult<SimilarAccount>> {
    const [items, total] = await Promise.all([
      this.persistenceManager.query<SimilarAccount>(
        QuerySpecification.withStatement(
          `
				match (u1:User),(u2:Account)
				WHERE u1 <> u2 AND u1.id = $accountId AND NOT (u1)-[:FRIEND]-(u2) AND NOT (u1)-[:FOLLOW]-(u2) AND NOT (u1)-[:FRIEND_REQUEST]->(u2)
				optional match (u1)-[:FRIEND|FOLLOW]-(u1f)
				optional match (u2)-[:FRIEND|FOLLOW]-(u2f)
				with u1,u2,collect(distinct id(u1f)) as u1Friends, collect(distinct id(u2f)) as u2Friends
				with u1,u2,gds.alpha.similarity.jaccard(u1Friends, u2Friends) as fjaccard

				optional match (u1)-[:LIKE]-(u1l)
				optional match (u2)-[:LIKE|PUBLISH_EVENT]-(u2l)
				with u1,u2,collect(distinct id(u1l)) as u1Likes, collect(distinct id(u2l)) as u2Likes,fjaccard
				with u1,u2,gds.alpha.similarity.jaccard(u1Likes, u2Likes) as ejaccard, fjaccard

				optional match (u1)-[:PREFER_CATEGORY]-(u1cats:Category)
				optional match (u2)-[:PREFER_CATEGORY|PUBLISH_EVENT|HAS_CATEGORY*1..2]-(u2cats:Category)
				with u1,u2,collect(distinct id(u1cats)) as u1Cats, collect(distinct id(u2cats)) as u2Cats,fjaccard,ejaccard
				with u1,u2,gds.alpha.similarity.jaccard(u1Cats, u2Cats) as cjaccard, ejaccard, fjaccard

				WITH u2 as account, (3.5*fjaccard + 5*ejaccard + 1.5*cjaccard)/10 as metric,u1 as u
				WHERE metric > 0.05
				WITH account,metric,u
				ORDER BY metric DESC
				call apoc.when(account:User,'
					optional match (item)-[:FRIEND]-(common:User)-[:FRIEND]-(user)
					optional match (user)-[rfriend:FRIEND|FRIEND_REQUEST]-(item)
					return item {
						.username, 
						.avatar, 
						.id, 
						friendsInCommon: count(distinct common), 
						friendshipStatus: CASE
															WHEN rfriend is null THEN "none" 
															WHEN toLower(type(rfriend)) = "friend" THEN "friend" 
															WHEN startNode(rfriend)=user THEN "requested"
															ELSE "friend_request" END,
						type:"user"} as result','
					optional match (user:User)-[:FOLLOW]->(item)
					return item {
						.username,
						.avatar,
						.id, 
						followers:count(distinct user), 
						type:"partner"} as result',
					{item:account,user:u}) yield value
				return value.result
				`,
        )
          .bind({
            accountId,
            threshold,
          })
          .skip(skip)
          .limit(limit),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
					MATCH (u:User)-[simm:SIMILAR]-(acc:Account)
					WHERE u.id = $accountId AND NOT (u)-[:FRIEND]-(acc) AND NOT (u)-[:FOLLOW]-(acc) AND NOT (u)-[:FRIEND_REQUEST]->(acc)
					WITH acc as account, (4*simm.friendsMetric + 5*simm.eventsMetric + 1*simm.categoriesMetric + 2*simm.followeesMetric)/12 as metric,u
					WHERE metric > $threshold
					RETURN count(account)
					`,
        ).bind({ accountId, threshold }),
      ),
    ]);
    return {
      items,
      total,
      pageSize: items.length,
      current: skip,
    };
  }

  async getSimilarEvents(
    eventId: string,
    skip: number,
    limit: number,
    meId: string,
  ): Promise<PaginatedFindResult<EventDetails>> {
    const [items, total] = await Promise.all([
      this.persistenceManager.query<EventDetails>(
        QuerySpecification.withStatement(
          `
					MATCH (e:Event)-[HAS_CATEGORY]->(c:Category)<-[:HAS_CATEGORY]-(similar:Event),(similar)-[:LIKE]-(whoLike:User)-[:LIKE]-(e)
					WHERE e.id = $eventId
					WITH similar as e,count(whoLike) as commonLikes
					ORDER BY commonLikes

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
						basePrice:e.basePrice
					} as eventInfo, me, e
					CALL {
						WITH e,me
						OPTIONAL MATCH (me)-[:FRIEND]-(f:User)-[:LIKE]->(e)
						RETURN f limit 3
					}
					return apoc.map.merge(eventInfo, {friends:collect( distinct f{.username, .avatar})})
			`,
        )
          .bind({
            eventId,
            meId,
          })
          .skip(skip)
          .limit(limit)
          .map((r) => {
            return {
              ...r,
              dateTimeInit: parseDate(r.dateTimeInit),
              dateTimeEnd: parseDate(r.dateTimeEnd),
              info: TextUtils.escapeAndParse(r.info),
              multimedia: TextUtils.escapeAndParse(r.multimedia),
            };
          }),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
					MATCH (e:Event)-[HAS_CATEGORY]->(c:Category)<-[:HAS_CATEGORY]-(similar:Event),(similar)-[:LIKE]-(whoLike:User)-[:LIKE]-(e)
					WHERE e.id = $eventId
					RETURN count(similar)
					`,
        ).bind({ eventId }),
      ),
    ]);

    return {
      items,
      total,
      pageSize: items.length,
      current: skip,
    };
  }
}
