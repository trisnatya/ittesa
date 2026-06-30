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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("../employees/employee.entity");
const request_entity_1 = require("../requests/request.entity");
const user_entity_1 = require("../users/user.entity");
const question_entity_1 = require("../questions/question.entity");
let DashboardService = class DashboardService {
    constructor(employeeRepository, requestRepository, userRepository, questionRepository) {
        this.employeeRepository = employeeRepository;
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
    }
    async getStats() {
        const [totalEmployees, employeesByStatus, totalRequests, requestsByStatus, totalUsers, totalQuestions, pendingQuestions, requestsByType,] = await Promise.all([
            this.employeeRepository.count(),
            this.getEmployeesByStatus(),
            this.requestRepository.count(),
            this.getRequestsByStatus(),
            this.userRepository.count({ where: { isActive: true } }),
            this.questionRepository.count(),
            this.questionRepository.count({ where: { status: question_entity_1.QuestionStatus.PENDING } }),
            this.getRequestsByType(),
        ]);
        return {
            employees: {
                total: totalEmployees,
                byStatus: employeesByStatus,
            },
            requests: {
                total: totalRequests,
                byStatus: requestsByStatus,
                byType: requestsByType,
            },
            users: {
                total: totalUsers,
            },
            questions: {
                total: totalQuestions,
                pending: pendingQuestions,
            },
        };
    }
    async getEmployeesByStatus() {
        const statuses = Object.values(employee_entity_1.MilestoneStatus);
        const result = {};
        for (const status of statuses) {
            result[status] = await this.employeeRepository.count({
                where: { status },
            });
        }
        return result;
    }
    async getRequestsByStatus() {
        const statuses = Object.values(request_entity_1.RequestStatus);
        const result = {};
        for (const status of statuses) {
            result[status] = await this.requestRepository.count({
                where: { status },
            });
        }
        return result;
    }
    async getRequestsByType() {
        const result = await this.requestRepository
            .createQueryBuilder('request')
            .leftJoin('request.requestType', 'requestType')
            .select('requestType.name', 'type')
            .addSelect('COUNT(*)', 'count')
            .groupBy('requestType.name')
            .getRawMany();
        return result;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(request_entity_1.Request)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map