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
exports.RequestTypesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const request_type_entity_1 = require("./request-type.entity");
let RequestTypesService = class RequestTypesService {
    constructor(requestTypeRepository) {
        this.requestTypeRepository = requestTypeRepository;
    }
    async findAll() {
        return this.requestTypeRepository.find({
            where: { isActive: true },
            order: { createdAt: 'ASC' },
        });
    }
    async findOne(id) {
        return this.requestTypeRepository.findOne({ where: { id } });
    }
    async create(data) {
        const requestType = this.requestTypeRepository.create(data);
        return this.requestTypeRepository.save(requestType);
    }
    async update(id, data) {
        await this.requestTypeRepository.update(id, data);
        return this.findOne(id);
    }
    async remove(id) {
        await this.requestTypeRepository.delete(id);
        return { message: 'Request type deleted successfully' };
    }
    async seed() {
        const count = await this.requestTypeRepository.count();
        if (count === 0) {
            const types = [
                { name: 'DPLK', description: 'Dana Pensiun Lembaga Keuangan' },
                { name: 'Housing', description: 'Kebutuhan Perumahan' },
                { name: 'Administration Later', description: 'Administrasi Tunda' },
                { name: 'HC Communication', description: 'Komunikasi HC' },
            ];
            for (const type of types) {
                await this.create(type);
            }
        }
    }
};
exports.RequestTypesService = RequestTypesService;
exports.RequestTypesService = RequestTypesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(request_type_entity_1.RequestType)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RequestTypesService);
//# sourceMappingURL=request-types.service.js.map