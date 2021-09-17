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
  ): Promise<ISearchResult<AccountItem>> {
    const items = await this.persistenceManager.query<
      ISearchResultItem<AccountItem>
    >(
      QuerySpecification.withStatement(
        `
				CALL db.index.fulltext.queryNodes('accounts','${q.processedQuery}') yield node,score
				CALL apoc.when(node:User,
				'return a{.fullname, .username, .id, .avatar, type:"user", friendshipStatus:"friend", privacy:"public"} as result',
				'return a{.businessName, .username, .id, .avatar, type:"partner", followers:0} as result',
				{a:node}) yield value
				RETURN {
					data: value.result,
					score:score
				}
				SKIP $skip
				LIMIT $limit
			`,
      ).bind({ limit: Integer.fromInt(limit), skip: Integer.fromInt(skip) }),
    );
    console.log(items);
    const total = await this.persistenceManager.getOne<number>(
      QuerySpecification.withStatement(`
				CALL db.index.fulltext.queryNodes('accounts','${q.processedQuery}') yield node, score
				RETURN count(node)
				`),
    );
    return {
      items,
      total,
      pageSize: items.length,
      current: skip,
    };
  }
}
