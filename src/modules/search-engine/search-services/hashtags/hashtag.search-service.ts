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
import { HashtagItem } from '../../search-results/hashtag.search-result';
import { HashtagQuery } from './hashtag.query';

@Injectable()
export class HashtagSearchService implements ISearchService<HashtagItem> {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async search(
    q: HashtagQuery,
    skip: number,
    limit: number,
  ): Promise<ISearchResult<HashtagItem>> {
    const items = await this.persistenceManager.query<
      ISearchResultItem<HashtagItem>
    >(
      QuerySpecification.withStatement(
        `
				CALL db.index.fulltext.queryNodes('hashtags','${q.processedQuery}') yield node, score
				RETURN {
    			data: {
						word:node.word,
						type:"hashtag",
						id:node.id
					},
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
				CALL db.index.fulltext.queryNodes('hashtags','${q.processedQuery}') yield node, score
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
