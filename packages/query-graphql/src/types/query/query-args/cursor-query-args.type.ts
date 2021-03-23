import { Class, Filter, SortField } from "@nestjs-query/core";
import { ArgsType, Field } from "@nestjs/graphql";
import { Validate, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PropertyMax } from "../../validators/property-max.validator";
import { DEFAULT_QUERY_OPTS } from "./constants";
import { CursorQueryArgsTypeOpts, QueryType } from "./interfaces";
import { CursorPagingType, getOrCreateCursorPagingType, PagingStrategies } from "../paging";
import { FilterType } from "../filter.type";
import { getOrCreateSortType } from "../sorting.type";
import { getOrCreateCursorConnectionType } from "../../connection";
import { ShopifyCursorQueryArgs, StaticShopifyCursorQueryType } from "../../../shopify-adapter/shopify.types";

export type CursorQueryArgsType<DTO> = QueryType<DTO, PagingStrategies.CURSOR>;
export function createCursorQueryArgsType<DTO>(
  DTOClass: Class<DTO>,
  opts: CursorQueryArgsTypeOpts<DTO> = { ...DEFAULT_QUERY_OPTS, pagingStrategy: PagingStrategies.CURSOR },
): StaticShopifyCursorQueryType<DTO, PagingStrategies.CURSOR> {

  const F = FilterType(DTOClass);
  const S = getOrCreateSortType(DTOClass);
  const P = getOrCreateCursorPagingType();
  const C = getOrCreateCursorConnectionType(DTOClass, opts);

  @ArgsType()
  class QueryArgs extends ShopifyCursorQueryArgs(DTOClass, opts) {
    static SortType = S;

    static FilterType = F;

    static PageType = P;

    static ConnectionType = C;

    @Field(() => P, {
      defaultValue: { first: opts.defaultResultSize ?? DEFAULT_QUERY_OPTS.defaultResultSize },
      description: 'Limit or page results.',
    })
    @ValidateNested()
    @Validate(PropertyMax, ['first', opts.maxResultsSize ?? DEFAULT_QUERY_OPTS.maxResultsSize])
    @Validate(PropertyMax, ['last', opts.maxResultsSize ?? DEFAULT_QUERY_OPTS.maxResultsSize])
    @Type(() => P)
    paging?: CursorPagingType;

    @Field(() => F, {
      defaultValue: !F.hasRequiredFilters ? opts.defaultFilter ?? DEFAULT_QUERY_OPTS.defaultFilter : undefined,
      description: 'Specify to filter the records returned.',
      nullable: false,
    })
    @ValidateNested()
    @Type(() => F)
    filter?: Filter<DTO>;

    @Field(() => [S], {
      defaultValue: opts.defaultSort ?? DEFAULT_QUERY_OPTS.defaultSort,
      description: 'Specify to sort results.',
    })
    @ValidateNested()
    @Type(() => S)
    sorting?: SortField<DTO>[];
  }

  return QueryArgs;
}
