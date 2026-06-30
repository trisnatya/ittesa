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
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const passport_1 = require("@nestjs/passport");
const requests_service_1 = require("./requests.service");
const requests_dto_1 = require("./requests.dto");
const request_entity_1 = require("./request.entity");
let RequestsController = class RequestsController {
    constructor(requestsService) {
        this.requestsService = requestsService;
    }
    async findAll(requestTypeId, status, userId) {
        return this.requestsService.findAll({ requestTypeId, status, userId });
    }
    async findOne(id) {
        return this.requestsService.findOne(id);
    }
    async create(createRequestDto, file, req) {
        if (file) {
            createRequestDto.filePath = file.path;
        }
        return this.requestsService.create(createRequestDto, req.user.id);
    }
    async update(id, updateRequestDto, file, req) {
        if (file) {
            updateRequestDto.filePath = file.path;
        }
        return this.requestsService.update(id, updateRequestDto, req.user.id);
    }
    async updateStatus(id, status, req) {
        return this.requestsService.updateStatus(id, status, req.user.id);
    }
    async remove(id, req) {
        return this.requestsService.remove(id, req.user.id);
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('requestTypeId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/requests',
            filename: (req, file, callback) => {
                const uniqueName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                callback(null, uniqueName);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(docx)$/)) {
                return callback(new Error('Only DOCX files are allowed'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requests_dto_1.CreateRequestDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/requests',
            filename: (req, file, callback) => {
                const uniqueName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                callback(null, uniqueName);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(docx)$/)) {
                return callback(new Error('Only DOCX files are allowed'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, requests_dto_1.UpdateRequestDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "remove", null);
exports.RequestsController = RequestsController = __decorate([
    (0, swagger_1.ApiTags)('Requests'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('requests'),
    __metadata("design:paramtypes", [requests_service_1.RequestsService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map