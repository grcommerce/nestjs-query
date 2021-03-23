"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateBuilder = void 0;
const common_1 = require("@nestjs/common");
var AggregateFuncs;
(function (AggregateFuncs) {
    AggregateFuncs["AVG"] = "AVG";
    AggregateFuncs["SUM"] = "SUM";
    AggregateFuncs["COUNT"] = "COUNT";
    AggregateFuncs["MAX"] = "MAX";
    AggregateFuncs["MIN"] = "MIN";
})(AggregateFuncs || (AggregateFuncs = {}));
const AGG_REGEXP = /(AVG|SUM|COUNT|MAX|MIN)_(.*)/;
class AggregateBuilder {
    static async asyncConvertToAggregateResponse(responsePromise) {
        const aggResponse = await responsePromise;
        return this.convertToAggregateResponse(aggResponse);
    }
    static getAggregateAliases(query) {
        const aggs = [
            [AggregateFuncs.COUNT, query.count],
            [AggregateFuncs.SUM, query.sum],
            [AggregateFuncs.AVG, query.avg],
            [AggregateFuncs.MAX, query.max],
            [AggregateFuncs.MIN, query.min],
        ];
        return aggs.reduce((cols, [func, fields]) => {
            const aliases = (fields !== null && fields !== void 0 ? fields : []).map((f) => this.getAggregateAlias(func, f));
            return [...cols, ...aliases];
        }, []);
    }
    static getAggregateAlias(func, field) {
        return `${func}_${field}`;
    }
    static convertToAggregateResponse(response) {
        return Object.keys(response).reduce((agg, resultField) => {
            const matchResult = AGG_REGEXP.exec(resultField);
            if (!matchResult) {
                throw new Error('Unknown aggregate column encountered.');
            }
            const [matchedFunc, matchedFieldName] = matchResult.slice(1);
            const aggFunc = matchedFunc.toLowerCase();
            const fieldName = matchedFieldName;
            const aggResult = agg[aggFunc] || {};
            return {
                ...agg,
                [aggFunc]: { ...aggResult, [fieldName]: response[resultField] },
            };
        }, {});
    }
    build(qb, aggregate, alias) {
        const selects = [
            ...this.createAggSelect(AggregateFuncs.COUNT, aggregate.count, alias),
            ...this.createAggSelect(AggregateFuncs.SUM, aggregate.sum, alias),
            ...this.createAggSelect(AggregateFuncs.AVG, aggregate.avg, alias),
            ...this.createAggSelect(AggregateFuncs.MAX, aggregate.max, alias),
            ...this.createAggSelect(AggregateFuncs.MIN, aggregate.min, alias),
        ];
        if (!selects.length) {
            throw new common_1.BadRequestException('No aggregate fields found.');
        }
        const [head, ...tail] = selects;
        return tail.reduce((acc, [select, selectAlias]) => acc.addSelect(select, selectAlias), qb.select(head[0], head[1]));
    }
    createAggSelect(func, fields, alias) {
        if (!fields) {
            return [];
        }
        return fields.map((field) => {
            const col = alias ? `${alias}.${field}` : field;
            return [`${func}(${col})`, AggregateBuilder.getAggregateAlias(func, field)];
        });
    }
}
exports.AggregateBuilder = AggregateBuilder;
//# sourceMappingURL=aggregate.builder.js.map