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
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const request_entity_1 = require("./request.entity");
const user_logs_service_1 = require("../user-logs/user-logs.service");
let RequestsService = class RequestsService {
    constructor(requestRepository, userLogsService) {
        this.requestRepository = requestRepository;
        this.userLogsService = userLogsService;
    }
    async findAll(filters) {
        const query = this.requestRepository
            .createQueryBuilder('request')
            .leftJoinAndSelect('request.requestType', 'requestType')
            .leftJoinAndSelect('request.user', 'user')
            .leftJoinAndSelect('request.employee', 'employee')
            .leftJoinAndSelect('request.template', 'template');
        if (filters?.requestTypeId) {
            query.andWhere('request.requestTypeId = :requestTypeId', {
                requestTypeId: filters.requestTypeId,
            });
        }
        if (filters?.status) {
            query.andWhere('request.status = :status', { status: filters.status });
        }
        if (filters?.userId) {
            query.andWhere('request.userId = :userId', { userId: filters.userId });
        }
        query.orderBy('request.createdAt', 'DESC');
        return query.getMany();
    }
    async findOne(id) {
        const request = await this.requestRepository.findOne({
            where: { id },
            relations: ['requestType', 'user', 'employee', 'template'],
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        return request;
    }
    async create(createRequestDto, userId) {
        const request = this.requestRepository.create({
            ...createRequestDto,
            userId,
        });
        const saved = await this.requestRepository.save(request);
        await this.userLogsService.createLog({
            userId,
            action: 'CREATE',
            module: 'REQUESTS',
            details: { requestId: saved.id, type: createRequestDto.requestTypeId },
        });
        return saved;
    }
    async update(id, updateRequestDto, userId) {
        const request = await this.findOne(id);
        Object.assign(request, updateRequestDto);
        const updated = await this.requestRepository.save(request);
        await this.userLogsService.createLog({
            userId,
            action: 'UPDATE',
            module: 'REQUESTS',
            details: { requestId: id },
        });
        return updated;
    }
    async updateStatus(id, status, userId) {
        const request = await this.findOne(id);
        request.status = status;
        request.reviewedById = userId;
        request.reviewedAt = new Date();
        const updated = await this.requestRepository.save(request);
        await this.userLogsService.createLog({
            userId,
            action: 'UPDATE_STATUS',
            module: 'REQUESTS',
            details: { requestId: id, newStatus: status },
        });
        return updated;
    }
    async remove(id, userId) {
        const request = await this.findOne(id);
        await this.requestRepository.remove(request);
        await this.userLogsService.createLog({
            userId,
            action: 'DELETE',
            module: 'REQUESTS',
            details: { requestId: id },
        });
        return { message: 'Request deleted successfully' };
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(request_entity_1.Request)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_logs_service_1.UserLogsService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map