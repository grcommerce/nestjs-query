import { Class, Filter, Query, SortDirection, SortField } from '@nestjs-query/core';
import { ArgsType, Field } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { ConnectionCursorType, CursorPagingType, StaticConnectionType } from '../types';
import { PagingStrategies, PagingTypes, QueryArgsTypeOpts, QueryType } from '../types/query';
import { SearchQueryParser } from './search-query-parser';
import { InferPagingTypeFromStrategy } from '../types/query/paging';

export type ContextOptions = any;

export const GraphqlDefault = {
  COUNT: 2,
  QUERY_OPTS: {
    defaultResultSize: 2,
    maxResultsSize: 50,
    defaultSort: [],
    defaultFilter: {},
  },
};

export function ShopifyCursorQueryArgs<DTO>(
  DTOClass: Class<DTO>,
  opts: QueryArgsTypeOpts<DTO> = {
    ...GraphqlDefault.QUERY_OPTS,
    pagingStrategy: PagingStrategies.CURSOR,
  },
): Class<ShopifyCursorQueryType<DTO, PagingStrategies.CURSOR>> {
  @ArgsType()
  class QueryArgs implements Query<DTO>, ShopifyCursorQueryArgsType<DTO> {
    @Field({ nullable: true })
    query?: string;
    @Field({ nullable: true })
    reverse?: boolean = false;
    @Field({ nullable: true })
    before?: ConnectionCursorType;
    @Field({ nullable: true })
    after?: ConnectionCursorType;
    @Min(opts.defaultResultSize || 0)
    @Max(opts.maxResultsSize || 0)
    @Field({ nullable: true })
    first?: number = opts.defaultResultSize;
    @Field({ nullable: true })
    @Max(opts.maxResultsSize || 0)
    last?: number;

    paging?: CursorPagingType;
    filter?: Filter<DTO>;
    sorting?: SortField<DTO>[];

    constructor(args: ShopifyCursorQueryArgsType<DTO>) {
      this.query = args && args.query;
      this.reverse = args && args.reverse;
      this.before = args && args.before;
      this.after = args && args.after;
      this.first = args && args.first;
      this.last = args && args.last;
      this.paging = args && args.paging;
      this.filter = args && args.filter;
      this.sorting = args && args.sorting;
    }

    toPaging(): PagingTypes {
      return ({
        strategy: PagingStrategies.CURSOR,
        first: this.first,
        last: this.last,
        before: this.before,
        after: this.after,
      } as unknown) as PagingTypes;
    }

    toFilter(context: ContextOptions): Filter<DTO> {
      let filter: any = this.query ? SearchQueryParser.parse(this.query) : this.filter;
      return filter;
    }

    toSorting(): SortField<DTO>[] {
      // @ts-ignore
      if (this.sortKey) {
        // @ts-ignore
        let keys = this.sortKey ? [this.sortKey] : [];
        return keys.map(key => ({
          field: key,
          direction: this.reverse ? SortDirection.DESC : SortDirection.ASC,
        })) as any;
      } else {
        return this.sorting && this.sorting.length > 0 ? this.sorting : [];
      }
    }

    toQuery<T>(context: ContextOptions): Query<T> {
      return {
        filter: this.toFilter(context),
        paging: this.toPaging(),
        sorting: this.toSorting(),
      } as any;
    }
  }

  return QueryArgs;
}

export interface ShopifyCursorQueryArgsType<DTO> extends Query<DTO> {
  query?: string;
  reverse?: boolean;
  before?: ConnectionCursorType;
  after?: ConnectionCursorType;
  first?: number;
  last?: number;
}

export interface ShopifyCursorQueryType<DTO, PS extends PagingStrategies>
  extends QueryType<DTO, PagingStrategies.CURSOR> {
  toPaging(): PagingTypes;
  toFilter(context: ContextOptions): Filter<DTO>;
  toSorting(): SortField<DTO>[];
  toQuery<T>(context: ContextOptions): QueryType<T, PagingStrategies>;
}

export interface StaticShopifyCursorQueryType<DTO, PS extends PagingStrategies>
  extends Class<ShopifyCursorQueryType<DTO, PS>> {
  SortType: Class<SortField<DTO>>;
  PageType: Class<InferPagingTypeFromStrategy<PS>>;
  FilterType: Class<Filter<DTO>>;
  ConnectionType: StaticConnectionType<DTO, PS>;
}
