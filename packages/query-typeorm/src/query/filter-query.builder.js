"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterQueryBuilder = void 0;
const core_1 = require("@nestjs-query/core");
const aggregate_builder_1 = require("./aggregate.builder");
const where_builder_1 = require("./where.builder");
class FilterQueryBuilder {
    constructor(repo, whereBuilder = new where_builder_1.WhereBuilder(), aggregateBuilder = new aggregate_builder_1.AggregateBuilder()) {
        this.repo = repo;
        this.whereBuilder = whereBuilder;
        this.aggregateBuilder = aggregateBuilder;
    }
    select(query) {
        const hasRelations = this.filterHasRelations(query.filter);
        let qb = this.createQueryBuilder();
        qb = hasRelations ? this.applyRelationJoins(qb, query.filter) : qb;
        qb = this.applyFilter(qb, query.filter, qb.alias);
        qb = this.applySorting(qb, query.sorting, qb.alias);
        qb = this.applyPaging(qb, query.paging, hasRelations);
        return qb;
    }
    selectById(id, query) {
        const hasRelations = this.filterHasRelations(query.filter);
        let qb = this.createQueryBuilder();
        qb = hasRelations ? this.applyRelationJoins(qb, query.filter) : qb;
        qb = qb.andWhereInIds(id);
        qb = this.applyFilter(qb, query.filter, qb.alias);
        qb = this.applySorting(qb, query.sorting, qb.alias);
        qb = this.applyPaging(qb, query.paging, hasRelations);
        return qb;
    }
    aggregate(query, aggregate) {
        let qb = this.createQueryBuilder();
        qb = this.applyAggregate(qb, aggregate, qb.alias);
        qb = this.applyFilter(qb, query.filter, qb.alias);
        return qb;
    }
    delete(query) {
        return this.applyFilter(this.repo.createQueryBuilder().delete(), query.filter);
    }
    softDelete(query) {
        return this.applyFilter(this.repo.createQueryBuilder().softDelete(), query.filter);
    }
    update(query) {
        const qb = this.applyFilter(this.repo.createQueryBuilder().update(), query.filter);
        return this.applySorting(qb, query.sorting);
    }
    applyPaging(qb, paging, useSkipTake) {
        if (!paging) {
            return qb;
        }
        if (useSkipTake) {
            return qb.take(paging.limit).skip(paging.offset);
        }
        return qb.limit(paging.limit).offset(paging.offset);
    }
    applyAggregate(qb, aggregate, alias) {
        return this.aggregateBuilder.build(qb, aggregate, alias);
    }
    applyFilter(qb, filter, alias) {
        if (!filter) {
            return qb;
        }
        return this.whereBuilder.build(qb, filter, this.getReferencedRelations(filter), alias);
    }
    applySorting(qb, sorts, alias) {
        if (!sorts) {
            return qb;
        }
        return sorts.reduce((prevQb, { field, direction, nulls }) => {
            const col = alias ? `${alias}.${field}` : `${field}`;
            return prevQb.addOrderBy(col, direction, nulls);
        }, qb);
    }
    createQueryBuilder() {
        return this.repo.createQueryBuilder();
    }
    applyRelationJoins(qb, filter) {
        if (!filter) {
            return qb;
        }
        const referencedRelations = this.getReferencedRelations(filter);
        return referencedRelations.reduce((rqb, relation) => rqb.leftJoin(`${rqb.alias}.${relation}`, relation), qb);
    }
    filterHasRelations(filter) {
        if (!filter) {
            return false;
        }
        return this.getReferencedRelations(filter).length > 0;
    }
    getReferencedRelations(filter) {
        const { relationNames } = this;
        const referencedFields = core_1.getFilterFields(filter);
        return referencedFields.filter((f) => relationNames.includes(f));
    }
    get relationNames() {
        return this.repo.metadata.relations.map((r) => r.propertyName);
    }
}
exports.FilterQueryBuilder = FilterQueryBuilder;
//# sourceMappingURL=filter-query.builder.js.map