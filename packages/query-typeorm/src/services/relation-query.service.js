"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationQueryService = void 0;
const core_1 = require("@nestjs-query/core");
const lodash_filter_1 = __importDefault(require("lodash.filter"));
const lodash_omit_1 = __importDefault(require("lodash.omit"));
const query_1 = require("../query");
class RelationQueryService {
    async queryRelations(RelationClass, relationName, dto, query) {
        if (Array.isArray(dto)) {
            return this.batchQueryRelations(RelationClass, relationName, dto, query);
        }
        const assembler = core_1.AssemblerFactory.getAssembler(RelationClass, this.getRelationEntity(relationName));
        const relationQueryBuilder = this.getRelationQueryBuilder(relationName);
        return assembler.convertAsyncToDTOs(relationQueryBuilder.select(dto, assembler.convertQuery(query)).getMany());
    }
    async aggregateRelations(RelationClass, relationName, dto, filter, aggregate) {
        if (Array.isArray(dto)) {
            return this.batchAggregateRelations(RelationClass, relationName, dto, filter, aggregate);
        }
        const assembler = core_1.AssemblerFactory.getAssembler(RelationClass, this.getRelationEntity(relationName));
        const relationQueryBuilder = this.getRelationQueryBuilder(relationName);
        const aggResponse = await query_1.AggregateBuilder.asyncConvertToAggregateResponse(relationQueryBuilder
            .aggregate(dto, assembler.convertQuery({ filter }), assembler.convertAggregateQuery(aggregate))
            .getRawOne());
        return assembler.convertAggregateResponse(aggResponse);
    }
    async countRelations(RelationClass, relationName, dto, filter) {
        if (Array.isArray(dto)) {
            return this.batchCountRelations(RelationClass, relationName, dto, filter);
        }
        const assembler = core_1.AssemblerFactory.getAssembler(RelationClass, this.getRelationEntity(relationName));
        const relationQueryBuilder = this.getRelationQueryBuilder(relationName);
        return relationQueryBuilder.select(dto, assembler.convertQuery({ filter })).getCount();
    }
    async findRelation(RelationClass, relationName, dto, opts) {
        if (Array.isArray(dto)) {
            return this.batchFindRelations(RelationClass, relationName, dto, opts);
        }
        const assembler = core_1.AssemblerFactory.getAssembler(RelationClass, this.getRelationEntity(relationName));
        const relationEntity = await this.getRelationQueryBuilder(relationName)
            .select(dto, { filter: opts === null || opts === void 0 ? void 0 : opts.filter, paging: { limit: 1 } })
            .getOne();
        return relationEntity ? assembler.convertToDTO(relationEntity) : undefined;
    }
    async addRelations(relationName, id, relationIds, opts) {
        const entity = await this.getById(id, opts);
        const relations = await this.getRelations(relationName, relationIds, opts === null || opts === void 0 ? void 0 : opts.relationFilter);
        if (!this.foundAllRelations(relationIds, relations)) {
            throw new Error(`Unable to find all ${relationName} to add to ${this.EntityClass.name}`);
        }
        await this.createRelationQueryBuilder(entity, relationName).add(relationIds);
        return entity;
    }
    async setRelation(relationName, id, relationId, opts) {
        const entity = await this.getById(id, opts);
        const relation = (await this.getRelations(relationName, [relationId], opts === null || opts === void 0 ? void 0 : opts.relationFilter))[0];
        if (!relation) {
            throw new Error(`Unable to find ${relationName} to set on ${this.EntityClass.name}`);
        }
        await this.createRelationQueryBuilder(entity, relationName).set(relationId);
        return entity;
    }
    async removeRelations(relationName, id, relationIds, opts) {
        const entity = await this.getById(id, opts);
        const relations = await this.getRelations(relationName, relationIds, opts === null || opts === void 0 ? void 0 : opts.relationFilter);
        if (!this.foundAllRelations(relationIds, relations)) {
            throw new Error(`Unable to find all ${relationName} to remove from ${this.EntityClass.name}`);
        }
        await this.createRelationQueryBuilder(entity, relationName).remove(relationIds);
        return entity;
    }
    async removeRelation(relationName, id, relationId, opts) {
        const entity = await this.getById(id, opts);
        const relation = (await this.getRelations(relationName, [relationId], opts === null || opts === void 0 ? void 0 : opts.relationFilter))[0];
        if (!relation) {
            throw new Error(`Unable to find ${relationName} to remove from ${this.EntityClass.name}`);
        }
        const meta = this.getRelationMeta(relationName);
        if (meta.isOneToOne || meta.isManyToOne) {
            await this.createRelationQueryBuilder(entity, relationName).set(null);
        }
        else {
            await this.createRelationQueryBuilder(entity, relationName).remove(relationId);
        }
        return entity;
    }
    getRelationQueryBuilder(name) {
        return new query_1.RelationQueryBuilder(this.repo, name);
    }
    async batchQueryRelations(RelationClass, relationName, entities, query) {
        const assembler = core_1.AssemblerFactory.getAssembler(RelationClass, this.getRelationEntity(relationName));
        const relationQueryBuilder = this.getRelationQueryBuilder(relationName);
        const convertedQuery = assembler.convertQuery(query);
        const entityRelations = await relationQueryBuilder.batchSelect(entities, convertedQuery).getRawAndEntities();
        return entityRelations.raw.reduce((results, rawRelation) => {
            var _a;
            const index = rawRelation.__nestjsQuery__entityIndex__;
            const e = entities[index];
            const relationDtos = assembler.convertToDTOs(this.getRelationsFromPrimaryKeys(relationQueryBuilder, rawRelation, entityRelations.entities));
            return results.set(e, [...((_a = results.get(e)) !== null && _a !== void 0 ? _a : []), ...relationDtos]);
        }, new Map());
    }
    async batchAggregateRelations(RelationClass, relationName, entities, filter, aggregate) {
        const assembler = core_1.AssemblerFactory.getAssembler(RelationClass, this.getRelationEntity(relationName));
        const relationQueryBuilder = this.getRelationQueryBuilder(relationName);
        const convertedQuery = assembler.convertQuery({ filter });
        const rawAggregates = await relationQueryBuilder
            .batchAggregate(entities, convertedQuery, aggregate)
            .getRawMany();
        return rawAggregates.reduce((results, relationAgg) => {
            const index = relationAgg.__nestjsQuery__entityIndex__;
            const e = entities[index];
            results.set(e, query_1.AggregateBuilder.convertToAggregateResponse(lodash_omit_1.default(relationAgg, relationQueryBuilder.entityIndexColName)));
            return results;
        }, new Map());
    }
    async batchCountRelations(RelationClass, relationName, entities, filter) {
        const assembler = core_1.AssemblerFactory.getAssembler(RelationClass, this.getRelationEntity(relationName));
        const relationQueryBuilder = this.getRelationQueryBuilder(relationName);
        const convertedQuery = assembler.convertQuery({ filter });
        const entityRelations = await Promise.all(entities.map((e) => relationQueryBuilder.select(e, convertedQuery).getCount()));
        return entityRelations.reduce((results, relationCount, index) => {
            const e = entities[index];
            results.set(e, relationCount);
            return results;
        }, new Map());
    }
    async batchFindRelations(RelationClass, relationName, dtos, opts) {
        const batchResults = await this.batchQueryRelations(RelationClass, relationName, dtos, {
            paging: { limit: 1 },
            filter: opts === null || opts === void 0 ? void 0 : opts.filter,
        });
        const results = new Map();
        batchResults.forEach((relation, dto) => {
            results.set(dto, relation[0]);
        });
        return results;
    }
    createRelationQueryBuilder(entity, relationName) {
        return this.repo.createQueryBuilder().relation(relationName).of(entity);
    }
    getRelationMeta(relationName) {
        const relationMeta = this.repo.metadata.relations.find((r) => r.propertyName === relationName);
        if (!relationMeta) {
            throw new Error(`Unable to find relation ${relationName} on ${this.EntityClass.name}`);
        }
        return relationMeta;
    }
    getRelationEntity(relationName) {
        const relationMeta = this.getRelationMeta(relationName);
        if (typeof relationMeta.type === 'string') {
            return this.repo.manager.getRepository(relationMeta.type).target;
        }
        return relationMeta.type;
    }
    getRelationsFromPrimaryKeys(relationBuilder, rawResult, relations) {
        const pks = relationBuilder.getRelationPrimaryKeysPropertyNameAndColumnsName();
        const filter = pks.reduce((keys, key) => ({ ...keys, [key.propertyName]: rawResult[key.columnName] }), {});
        return lodash_filter_1.default(relations, filter);
    }
    getRelations(relationName, ids, filter) {
        const relationQueryBuilder = this.getRelationQueryBuilder(relationName).filterQueryBuilder;
        return relationQueryBuilder.selectById(ids, { filter }).getMany();
    }
    foundAllRelations(relationIds, relations) {
        return new Set([...relationIds]).size === relations.length;
    }
}
exports.RelationQueryService = RelationQueryService;
//# sourceMappingURL=relation-query.service.js.map