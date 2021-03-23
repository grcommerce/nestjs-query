"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhereBuilder = void 0;
const typeorm_1 = require("typeorm");
const sql_comparison_builder_1 = require("./sql-comparison.builder");
class WhereBuilder {
    constructor(sqlComparisonBuilder = new sql_comparison_builder_1.SQLComparisonBuilder()) {
        this.sqlComparisonBuilder = sqlComparisonBuilder;
    }
    build(where, filter, relationNames, alias) {
        const { and, or } = filter;
        if (and && and.length) {
            this.filterAnd(where, and, relationNames, alias);
        }
        if (or && or.length) {
            this.filterOr(where, or, relationNames, alias);
        }
        return this.filterFields(where, filter, relationNames, alias);
    }
    filterAnd(where, filters, relationNames, alias) {
        return where.andWhere(new typeorm_1.Brackets((qb) => filters.reduce((w, f) => qb.andWhere(this.createBrackets(f, relationNames, alias)), qb)));
    }
    filterOr(where, filter, relationNames, alias) {
        return where.andWhere(new typeorm_1.Brackets((qb) => filter.reduce((w, f) => qb.orWhere(this.createBrackets(f, relationNames, alias)), qb)));
    }
    createBrackets(filter, relationNames, alias) {
        return new typeorm_1.Brackets((qb) => this.build(qb, filter, relationNames, alias));
    }
    filterFields(where, filter, relationNames, alias) {
        return Object.keys(filter).reduce((w, field) => {
            if (field !== 'and' && field !== 'or') {
                return this.withFilterComparison(where, field, this.getField(filter, field), relationNames, alias);
            }
            return w;
        }, where);
    }
    getField(obj, field) {
        return obj[field];
    }
    withFilterComparison(where, field, cmp, relationNames, alias) {
        if (relationNames.includes(field)) {
            return this.withRelationFilter(where, field, cmp);
        }
        return where.andWhere(new typeorm_1.Brackets((qb) => {
            const opts = Object.keys(cmp);
            const sqlComparisons = opts.map((cmpType) => this.sqlComparisonBuilder.build(field, cmpType, cmp[cmpType], alias));
            sqlComparisons.map(({ sql, params }) => qb.orWhere(sql, params));
        }));
    }
    withRelationFilter(where, field, cmp) {
        return where.andWhere(new typeorm_1.Brackets((qb) => {
            const relationWhere = new WhereBuilder();
            return relationWhere.build(qb, cmp, [], field);
        }));
    }
}
exports.WhereBuilder = WhereBuilder;
//# sourceMappingURL=where.builder.js.map