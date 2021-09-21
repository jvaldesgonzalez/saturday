import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { Integer } from 'neo4j-driver-core';
import {
  ISearchResult,
  ISearchResultItem,
} from '../../common/search-result.interface';
import { ISearchService } from '../../common/search-service.interface';
import { AccountItem } from '../../search-results/account.search-result';
import { AccountQuery } from './account.query';

@Injectable()
export class AccountSearchService implements ISearchService<AccountItem> {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async search(
    q: AccountQuery,
    skip: number,
    limit: number,
    requesterId: string,
  ): Promise<ISearchResult<AccountItem>> {
    const [items, total] = await Promise.all([
      this.persistenceManager.query<ISearchResultItem<AccountItem>>(
        QuerySpecification.withStatement(
          `
				CALL db.index.fulltext.queryNodes('accounts','${q.processedQuery}') yield node,score
				CALL apoc.when(node:User,
				'optional match (a)-[r]-(u:User) where u.id = uId return a{.fullname, .username, .id, .avatar, type:"user", friendshipStatus:toLower(type(r)), privacy:"public"} as result',
				'optional match (a)-[r:FOLLOW]-(u:User) where u.id = uId optional match (n:User)-[:FOLLOW]->(a) return a{.businessName, .username, .id, .avatar, type:"partner", followers:count(distinct n), IFollowThis: r is not null } as result',
				{a:node,uId:$uId}) yield value
				RETURN {
					data: value.result,
					score:score
				}
				SKIP $skip
				LIMIT $limit
			`,
        ).bind({
          limit: Integer.fromInt(limit),
          skip: Integer.fromInt(skip),
          uId: requesterId,
        }),
      ),
      this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(`
				CALL db.index.fulltext.queryNodes('accounts','${q.processedQuery}') yield node, score
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
