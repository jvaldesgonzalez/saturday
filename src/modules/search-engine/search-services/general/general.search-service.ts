import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { Integer } from 'neo4j-driver-core';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
import { Query } from '../../common/search-query.abstract';
import {
  ISearchResult,
  ISearchResultItem,
} from '../../common/search-result.interface';
import { ISearchService } from '../../common/search-service.interface';
import { GeneralSearchItem } from '../../search-results/general.search-result';

@Injectable()
export class GeneralSearchService implements ISearchService<GeneralSearchItem> {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async search(
    q: Query,
    skip: number,
    limit: number,
    requesterId: string,
  ): Promise<ISearchResult<GeneralSearchItem>> {
    const [items, total] = await Promise.all([
      this.persistenceManager.query<ISearchResultItem<GeneralSearchItem>>(
        QuerySpecification.withStatement(
          `
						CALL db.index.fulltext.queryNodes('search_engine','${q.processedQuery}') yield node,score
						CALL apoc.case([
							node:User,
								'optional match (a)-[rfriend:FRIEND|FRIEND_REQUEST]-(u:User) 
								where u.id = uId 
								return a{.fullname, .username, .id, .avatar, type:"user",
									friendshipStatus:CASE
																		WHEN rfriend is null THEN "none" 
																		WHEN toLower(type(rfriend)) = "friend" THEN "friend" 
																		WHEN startNode(rfriend)=u THEN "requested"
																		ELSE "friend_request" END,
									privacy:"public"
								} as result',
						node:Partner,
							'optional match (a)-[r:FOLLOW]-(u:User) 
							where u.id = uId 
							optional match (n:User)-[:FOLLOW]->(a) 
							return a{.businessName, .username, .id, .avatar, type:"partner", followers:count(distinct n), IFollowThis: r is not null } as result',
						node:Hashtag,
							'RETURN {
									word:node.word,
									type:"hashtag",
									id:node.id
							} as result',
						node:Event,
							'MATCH (place:Place)--(a)-[:PUBLISH_EVENT]-(publisher:Partner),
							(c:Category)--(a)
							RETURN {
									id:a.id,
									publisher: publisher{.id, .avatar, .username},
									type:"event",
									name:a.name,
									multimedia: a.multimedia,
									place: place {.name, .address},
									dateTimeInit:a.dateTimeInit,
									dateTimeEnd:a.dateTimeEnd,
									basePrice:a.basePrice
							} as result'
					],
					'return null as result',
					{a:node,uId:$uId}) yield value
					RETURN {
						data:value.result,
						score:score
					}
					SKIP $skip
					LIMIT $limit
			`,
        )
          .bind({
            limit: Integer.fromInt(limit),
            skip: Integer.fromInt(skip),
            uId: requesterId,
          })
          .map((r) => {
            switch (r.data.type) {
              case 'user':
                r.data.friendshipStatus = r.data.friendshipStatus && 'none';
                break;
              case 'event':
                r.data.multimedia = TextUtils.escapeAndParse(r.data.multimedia);
                r.data.dateTimeInit = parseDate(r.data.dateTimeInit);
                r.data.dateTimeEnd = parseDate(r.data.dateTimeEnd);
                break;
            }
            return r;
          }),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(`
				CALL db.index.fulltext.queryNodes('search_engine','${q.processedQuery}') yield node, score
				RETURN count(node)
				`),
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
