"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmQueryService = void 0;
const common_1 = require("@nestjs/common");
const query_1 = require("../query");
const relation_query_service_1 = require("./relation-query.service");
class TypeOrmQueryService extends relation_query_service_1.RelationQueryService {
    constructor(repo, opts) {
        var _a, _b;
        super();
        this.repo = repo;
        this.filterQueryBuilder = (_a = opts === null || opts === void 0 ? void 0 : opts.filterQueryBuilder) !== null && _a !== void 0 ? _a : new query_1.FilterQueryBuilder(this.repo);
        this.useSoftDelete = (_b = opts === null || opts === void 0 ? void 0 : opts.useSoftDelete) !== null && _b !== void 0 ? _b : false;
    }
    get EntityClass() {
        return this.repo.target;
    }
    async query(query) {
        return this.filterQueryBuilder.select(query).getMany();
    }
    async aggregate(filter, aggregate) {
        return query_1.AggregateBuilder.asyncConvertToAggregateResponse(this.filterQueryBuilder.aggregate({ filter }, aggregate).getRawOne());
    }
    async count(filter) {
        return this.filterQueryBuilder.select({ filter }).getCount();
    }
    async findById(id, opts) {
        return this.filterQueryBuilder.selectById(id, opts !== null && opts !== void 0 ? opts : {}).getOne();
    }
    async getById(id, opts) {
        const entity = await this.findById(id, opts);
        if (!entity) {
            throw new common_1.NotFoundException(`Unable to find ${this.EntityClass.name} with id: ${id}`);
        }
        return entity;
    }
    async createOne(record) {
        const entity = await this.ensureIsEntityAndDoesNotExist(record);
        return this.repo.save(entity);
    }
    async createMany(records) {
        const entities = await Promise.all(records.map((r) => this.ensureIsEntityAndDoesNotExist(r)));
        return this.repo.save(entities);
    }
    async updateOne(id, update, opts) {
        this.ensureIdIsNotPresent(update);
        const entity = await this.getById(id, opts);
        return this.repo.save(this.repo.merge(entity, update));
    }
    async updateMany(update, filter) {
        this.ensureIdIsNotPresent(update);
        const updateResult = await this.filterQueryBuilder
            .update({ filter })
            .set({ ...update })
            .execute();
        return { updatedCount: updateResult.affected || 0 };
    }
    async deleteOne(id, opts) {
        const entity = await this.getById(id, opts);
        if (this.useSoftDelete) {
            return this.repo.softRemove(entity);
        }
        return this.repo.remove(entity);
    }
    async deleteMany(filter) {
        let deleteResult;
        if (this.useSoftDelete) {
            deleteResult = await this.filterQueryBuilder.softDelete({ filter }).execute();
        }
        else {
            deleteResult = await this.filterQueryBuilder.delete({ filter }).execute();
        }
        return { deletedCount: deleteResult.affected || 0 };
    }
    async restoreOne(id, opts) {
        this.ensureSoftDeleteEnabled();
        await this.repo.restore(id);
        return this.getById(id, opts);
    }
    async restoreMany(filter) {
        this.ensureSoftDeleteEnabled();
        const result = await this.filterQueryBuilder.softDelete({ filter }).restore().execute();
        return { updatedCount: result.affected || 0 };
    }
    async ensureIsEntityAndDoesNotExist(e) {
        if (!(e instanceof this.EntityClass)) {
            return this.ensureEntityDoesNotExist(this.repo.create(e));
        }
        return this.ensureEntityDoesNotExist(e);
    }
    async ensureEntityDoesNotExist(e) {
        if (this.repo.hasId(e)) {
            const found = await this.repo.findOne(this.repo.getId(e));
            if (found) {
                throw new Error('Entity already exists');
            }
        }
        return e;
    }
    ensureIdIsNotPresent(e) {
        if (this.repo.hasId(e)) {
            throw new Error('Id cannot be specified when updating');
        }
    }
    ensureSoftDeleteEnabled() {
        if (!this.useSoftDelete) {
            throw new common_1.MethodNotAllowedException(`Restore not allowed for non soft deleted entity ${this.EntityClass.name}.`);
        }
    }
}
exports.TypeOrmQueryService = TypeOrmQueryService;
//# sourceMappingURL=typeorm-query.service.js.map