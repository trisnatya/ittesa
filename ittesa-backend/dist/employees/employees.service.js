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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("./employee.entity");
const user_logs_service_1 = require("../user-logs/user-logs.service");
let EmployeesService = class EmployeesService {
    constructor(employeeRepository, userLogsService) {
        this.employeeRepository = employeeRepository;
        this.userLogsService = userLogsService;
    }
    async findAll(status, search) {
        const query = this.employeeRepository
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.createdBy', 'createdBy');
        if (status) {
            query.andWhere('employee.status = :status', { status });
        }
        if (search) {
            query.andWhere('(employee.fullName ILIKE :search OR employee.nik ILIKE :search)', { search: `%${search}%` });
        }
        query.orderBy('employee.createdAt', 'DESC');
        return query.getMany();
    }
    async findOne(id) {
        const employee = await this.employeeRepository.findOne({
            where: { id },
            relations: ['createdBy'],
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        return employee;
    }
    async create(createEmployeeDto, userId) {
        const employee = this.employeeRepository.create({
            ...createEmployeeDto,
            createdById: userId,
        });
        const saved = await this.employeeRepository.save(employee);
        await this.userLogsService.createLog({
            userId,
            action: 'CREATE',
            module: 'EMPLOYEES',
            details: { employeeId: saved.id, nik: saved.nik },
        });
        return saved;
    }
    async update(id, updateEmployeeDto, userId) {
        const employee = await this.findOne(id);
        Object.assign(employee, updateEmployeeDto);
        const updated = await this.employeeRepository.save(employee);
        await this.userLogsService.createLog({
            userId,
            action: 'UPDATE',
            module: 'EMPLOYEES',
            details: { employeeId: id },
        });
        return updated;
    }
    async remove(id, userId) {
        const employee = await this.findOne(id);
        await this.employeeRepository.remove(employee);
        await this.userLogsService.createLog({
            userId,
            action: 'DELETE',
            module: 'EMPLOYEES',
            details: { employeeId: id },
        });
        return { message: 'Employee deleted successfully' };
    }
    async findByStatus(status) {
        return this.employeeRepository.find({
            where: { status },
            relations: ['createdBy'],
            order: { createdAt: 'DESC' },
        });
    }
    async updateStatus(id, status, userId) {
        const employee = await this.findOne(id);
        employee.status = status;
        const updated = await this.employeeRepository.save(employee);
        await this.userLogsService.createLog({
            userId,
            action: 'UPDATE_STATUS',
            module: 'EMPLOYEES',
            details: { employeeId: id, newStatus: status },
        });
        return updated;
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_logs_service_1.UserLogsService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map