import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { DateTime } from 'neo4j-driver-core';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
import {
  ISearchResult,
  ISearchResultItem,
} from '../../common/search-result.interface';
import { ISearchService } from '../../common/search-service.interface';
import { EventItem } from '../../search-results/event.search-result';
import { EventQuery } from './events.query';

@Injectable()
export class EventSearchService implements ISearchService<EventItem> {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async search(
    q: EventQuery,
    skip: number,
    limit: number,
    requesterId: string,
    dateInterval?: { from: Date; to: Date },
    categories: string[] = [],
    priceInterval?: { from: number; to: number },
    locationId?: string,
  ): Promise<ISearchResult<EventItem>> {
    const items = await this.persistenceManager.query<
      ISearchResultItem<EventItem>
    >(
      QuerySpecification.withStatement(
        `
				CALL db.index.fulltext.queryNodes('search_engine','${
          q.processedQuery
        }') yield node, score
				WHERE node:Event
				MATCH (l:Location)--(place:Place)--(node)-[:PUBLISH_EVENT]-(publisher:Partner),
				(c:Category)--(node)
				WHERE true
				${
          dateInterval
            ? 'AND node.dateTimeInit >= $fromDate AND node.dateTimeEnd <= $toDate'
            : ''
        } ${categories.some((i) => i) ? 'AND c.id IN $categories' : ''}
        ${locationId ? 'AND l.id = $locationId' : ''}
				${
          priceInterval
            ? 'AND node.basePrice >= $fromPrice AND node.topPrice <= $toPrice'
            : ''
        } 
				RETURN {
    			data: {
						id: node.id,
						publisher: publisher{.id, .avatar, .username},
						type:"event",
						name:node.name,
						multimedia: node.multimedia,
						place: place {.name, .address},
						dateTimeInit:node.dateTimeInit,
						dateTimeEnd:node.dateTimeEnd,
						basePrice:node.basePrice
					},
    			score:score
				}
			`,
      )
        .bind({
          categories,
          fromDate: dateInterval
            ? DateTime.fromStandardDate(dateInterval.from)
            : null,
          toDate: dateInterval
            ? DateTime.fromStandardDate(dateInterval.to)
            : null,
          fromPrice: priceInterval ? priceInterval.from : null,
          toPrice: priceInterval ? priceInterval.to : null,
          locationId: locationId,
        })
        .skip(skip)
        .limit(limit)
        .map((r) => {
          r.data.multimedia = TextUtils.escapeAndParse(r.data.multimedia);
          r.data.dateTimeEnd = parseDate(r.data.dateTimeEnd);
          r.data.dateTimeInit = parseDate(r.data.dateTimeInit);
          return r;
        }),
    );
    const total = await this.persistenceManager.getOne<number>(
      QuerySpecification.withStatement(
        `
				CALL db.index.fulltext.queryNodes('search_engine','${
          q.processedQuery
        }') yield node, score
				WHERE node:Event
				MATCH (l:Location)--(place:Place)--(node)-[:PUBLISH_EVENT]-(publisher:Partner),
				(c:Category)--(node)
				WHERE node.dateTimeEnd >= datetime()
				${
          dateInterval
            ? 'AND node.dateTimeInit >= $fromDate AND node.dateTimeEnd <= $toDate'
            : ''
        } ${categories.some((i) => i) ? 'AND c.id IN $categories' : ''}
        ${locationId ? 'AND l.id = $locationId' : ''}
				${
          priceInterval
            ? 'AND node.basePrice >= $fromPrice AND node.topPrice <= $toPrice'
            : ''
        } 
				RETURN count(node)
				`,
      ).bind({
        categories,
        fromDate: dateInterval
          ? DateTime.fromStandardDate(dateInterval.from)
          : null,
        toDate: dateInterval
          ? DateTime.fromStandardDate(dateInterval.to)
          : null,
        fromPrice: priceInterval ? priceInterval.from : null,
        toPrice: priceInterval ? priceInterval.to : null,
        locationId: locationId,
      }),
    );
    return {
      items,
      total,
      pageSize: items.length,
      current: skip,
    };
  }

  async filter(
    skip: number,
    limit: number,
    requesterId: string,
    dateInterval?: { from: Date; to: Date },
    categories: string[] = [],
    priceInterval?: { from: number; to: number },
    locationId?: string,
  ): Promise<ISearchResult<EventItem>> {
    const items = await this.persistenceManager.query<
      ISearchResultItem<EventItem>
    >(
      QuerySpecification.withStatement(
        `
				MATCH (l:Location)--(place:Place)--(node:Event)-[:PUBLISH_EVENT]-(publisher:Partner),
				(c:Category)--(node)
				WHERE node.dateTimeEnd >= datetime()
				${
          dateInterval
            ? 'AND node.dateTimeInit >= $fromDate AND node.dateTimeEnd <= $toDate'
            : ''
        } ${categories.some((i) => i) ? 'AND c.id IN $categories' : ''}
        ${locationId ? 'AND l.id = $locationId' : ''}
				${
          priceInterval
            ? 'AND node.basePrice >= $fromPrice AND node.topPrice <= $toPrice'
            : ''
        } 
				RETURN {
    			data: {
						id: node.id,
						publisher: publisher{.id, .avatar, .username},
						type:"event",
						name:node.name,
						multimedia: node.multimedia,
						place: place {.name, .address},
						dateTimeInit:node.dateTimeInit,
						dateTimeEnd:node.dateTimeEnd,
						basePrice:node.basePrice
					},
    			score:1.0
				}
			`,
      )
        .bind({
          categories,
          fromDate: dateInterval
            ? DateTime.fromStandardDate(dateInterval.from)
            : null,
          toDate: dateInterval
            ? DateTime.fromStandardDate(dateInterval.to)
            : null,
          fromPrice: priceInterval ? priceInterval.from : null,
          toPrice: priceInterval ? priceInterval.to : null,
          locationId: locationId,
        })
        .skip(skip)
        .limit(limit)
        .map((r) => {
          r.data.multimedia = TextUtils.escapeAndParse(r.data.multimedia);
          r.data.dateTimeEnd = parseDate(r.data.dateTimeEnd);
          r.data.dateTimeInit = parseDate(r.data.dateTimeInit);
          return r;
        }),
    );
    const total = await this.persistenceManager.getOne<number>(
      QuerySpecification.withStatement(
        `
				MATCH (l:Location)--(place:Place)--(node:Event)-[:PUBLISH_EVENT]-(publisher:Partner),
				(c:Category)--(node)
				WHERE node.dateTimeEnd >= datetime()
				${
          dateInterval
            ? 'AND node.dateTimeInit >= $fromDate AND node.dateTimeEnd <= $toDate'
            : ''
        } ${categories.some((i) => i) ? 'AND c.id IN $categories' : ''}
        ${locationId ? 'AND l.id = $locationId' : ''}
				${
          priceInterval
            ? 'AND node.basePrice >= $fromPrice AND node.topPrice <= $toPrice'
            : ''
        } 
				RETURN count(node)
				`,
      ).bind({
        categories,
        fromDate: dateInterval
          ? DateTime.fromStandardDate(dateInterval.from)
          : null,
        toDate: dateInterval
          ? DateTime.fromStandardDate(dateInterval.to)
          : null,
        fromPrice: priceInterval ? priceInterval.from : null,
        toPrice: priceInterval ? priceInterval.to : null,
        locationId: locationId,
      }),
    );
    return {
      items,
      total,
      pageSize: items.length,
      current: skip,
    };
  }
}
