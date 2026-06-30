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
exports.EmployeesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const path_1 = require("path");
const passport_1 = require("@nestjs/passport");
const employees_service_1 = require("./employees.service");
const employees_dto_1 = require("./employees.dto");
const employee_entity_1 = require("./employee.entity");
const uuid_1 = require("uuid");
let EmployeesController = class EmployeesController {
    constructor(employeesService) {
        this.employeesService = employeesService;
    }
    async findAll(status, search) {
        return this.employeesService.findAll(status, search);
    }
    async export(res) {
        const employees = await this.employeesService.findAll();
        const headers = ['NIK', 'Full Name', 'Email', 'Directorate', 'Unit', 'Position', 'Status'];
        const csvContent = [
            headers.join(','),
            ...employees.map((emp) => [
                emp.nik,
                `"${emp.fullName}"`,
                emp.email || '',
                `"${emp.directorate}"`,
                `"${emp.unit}"`,
                emp.position || '',
                emp.status,
            ].join(',')),
        ].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=employees.csv');
        res.send(csvContent);
    }
    async findOne(id) {
        return this.employeesService.findOne(id);
    }
    async create(createEmployeeDto, file, req) {
        if (file) {
            createEmployeeDto.cvFilePath = file.path;
        }
        return this.employeesService.create(createEmployeeDto, req.user.id);
    }
    async update(id, updateEmployeeDto, file, req) {
        if (file) {
            updateEmployeeDto.cvFilePath = file.path;
        }
        return this.employeesService.update(id, updateEmployeeDto, req.user.id);
    }
    async remove(id, req) {
        return this.employeesService.remove(id, req.user.id);
    }
    async updateStatus(id, status, req) {
        return this.employeesService.updateStatus(id, status, req.user.id);
    }
};
exports.EmployeesController = EmployeesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "export", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('cvFile', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/cv',
            filename: (req, file, callback) => {
                const uniqueName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                callback(null, uniqueName);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
                return callback(new Error('Only PDF and DOC files are allowed'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employees_dto_1.CreateEmployeeDto, Object, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('cvFile', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/cv',
            filename: (req, file, callback) => {
                const uniqueName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                callback(null, uniqueName);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
                return callback(new Error('Only PDF and DOC files are allowed'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employees_dto_1.UpdateEmployeeDto, Object, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "updateStatus", null);
exports.EmployeesController = EmployeesController = __decorate([
    (0, swagger_1.ApiTags)('Employees'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('employees'),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService])
], EmployeesController);
//# sourceMappingURL=employees.controller.js.map