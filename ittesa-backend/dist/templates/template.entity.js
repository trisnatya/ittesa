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
exports.Template = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../common/entities/base.entity");
const request_type_entity_1 = require("../request-types/request-type.entity");
let Template = class Template extends base_entity_1.BaseEntity {
};
exports.Template = Template;
__decorate([
    (0, typeorm_1.ManyToOne)(() => request_type_entity_1.RequestType),
    (0, typeorm_1.JoinColumn)({ name: 'request_type_id' }),
    __metadata("design:type", request_type_entity_1.RequestType)
], Template.prototype, "requestType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'request_type_id', type: 'uuid' }),
    __metadata("design:type", String)
], Template.prototype, "requestTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Template.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_path', type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Template.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Template.prototype, "description", void 0);
exports.Template = Template = __decorate([
    (0, typeorm_1.Entity)('templates')
], Template);
//# sourceMappingURL=template.entity.js.map