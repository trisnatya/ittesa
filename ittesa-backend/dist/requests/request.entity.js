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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = exports.RequestStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../common/entities/base.entity");
const request_type_entity_1 = require("../request-types/request-type.entity");
const user_entity_1 = require("../users/user.entity");
const employee_entity_1 = require("../employees/employee.entity");
const template_entity_1 = require("../templates/template.entity");
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["DRAFT"] = "draft";
    RequestStatus["SUBMITTED"] = "submitted";
    RequestStatus["COMPLETE"] = "complete";
    RequestStatus["REJECTED"] = "rejected";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
let Request = class Request extends base_entity_1.BaseEntity {
};
exports.Request = Request;
__decorate([
    (0, typeorm_1.ManyToOne)(() => request_type_entity_1.RequestType),
    (0, typeorm_1.JoinColumn)({ name: 'request_type_id' }),
    __metadata("design:type", request_type_entity_1.RequestType)
], Request.prototype, "requestType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'request_type_id', type: 'uuid' }),
    __metadata("design:type", String)
], Request.prototype, "requestTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Request.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], Request.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", employee_entity_1.Employee)
], Request.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employee_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Request.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => template_entity_1.Template, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'template_id' }),
    __metadata("design:type", template_entity_1.Template)
], Request.prototype, "template", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'template_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "templateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_path', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RequestStatus,
        default: RequestStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Request.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'reviewed_by' }),
    __metadata("design:type", user_entity_1.User)
], Request.prototype, "reviewedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reviewed_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "reviewedById", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reviewed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Request.prototype, "reviewedAt", void 0);
exports.Request = Request = __decorate([
    (0, typeorm_1.Entity)('requests')
], Request);
//# sourceMappingURL=request.entity.js.map