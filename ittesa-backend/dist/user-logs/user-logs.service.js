"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_log_entity_1 = require("./user-log.entity");
let UserLogsService = class UserLogsService {
    constructor(userLogRepository) {
        this.userLogRepository = userLogRepository;
    }
    async createLog(dto) {
        const log = this.userLogRepository.create(dto);
        return this.userLogRepository.save(log);
    }
    async findAll(filters) {
        const query = this.userLogRepository
            .createQueryBuilder('log')
            .leftJoinAndSelect('log.user', 'user');
        if (filters?.userId) {
            query.andWhere('log.userId = :userId', { userId: filters.userId });
        }
        if (filters?.action) {
            query.andWhere('log.action = :action', { action: filters.action });
        }
        if (filters?.module) {
            query.andWhere('log.module = :module', { module: filters.module });
        }
        if (filters?.startDate && filters?.endDate) {
            query.andWhere('log.createdAt BETWEEN :startDate AND :endDate', {
                startDate: filters.startDate,
                endDate: filters.endDate,
            });
        }
        query.orderBy('log.createdAt', 'DESC');
        return query.getMany();
    }
};
exports.UserLogsService = UserLogsService;
exports.UserLogsService = UserLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_log_entity_1.UserLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserLogsService);
//# sourceMappingURL=user-logs.service.js.map