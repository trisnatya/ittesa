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
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const template_entity_1 = require("./template.entity");
let TemplatesService = class TemplatesService {
    constructor(templateRepository) {
        this.templateRepository = templateRepository;
    }
    async findAll(requestTypeId) {
        const query = this.templateRepository
            .createQueryBuilder('template')
            .leftJoinAndSelect('template.requestType', 'requestType');
        if (requestTypeId) {
            query.andWhere('template.requestTypeId = :requestTypeId', {
                requestTypeId,
            });
        }
        query.orderBy('template.createdAt', 'DESC');
        return query.getMany();
    }
    async findOne(id) {
        const template = await this.templateRepository.findOne({
            where: { id },
            relations: ['requestType'],
        });
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        return template;
    }
    async create(data) {
        const template = this.templateRepository.create(data);
        return this.templateRepository.save(template);
    }
    async update(id, data) {
        const template = await this.findOne(id);
        Object.assign(template, data);
        return this.templateRepository.save(template);
    }
    async remove(id) {
        const template = await this.findOne(id);
        await this.templateRepository.remove(template);
        return { message: 'Template deleted successfully' };
    }
};
exports.TemplatesService = TemplatesService;
exports.TemplatesService = TemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(template_entity_1.Template)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TemplatesService);
//# sourceMappingURL=templates.service.js.map