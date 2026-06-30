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
exports.Question = exports.QuestionStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../common/entities/base.entity");
const user_entity_1 = require("../users/user.entity");
var QuestionStatus;
(function (QuestionStatus) {
    QuestionStatus["PENDING"] = "pending";
    QuestionStatus["ANSWERED"] = "answered";
})(QuestionStatus || (exports.QuestionStatus = QuestionStatus = {}));
let Question = class Question extends base_entity_1.BaseEntity {
};
exports.Question = Question;
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Question.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], Question.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Question.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Question.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: QuestionStatus,
        default: QuestionStatus.PENDING,
    }),
    __metadata("design:type", String)
], Question.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'answered_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Question.prototype, "answeredAt", void 0);
exports.Question = Question = __decorate([
    (0, typeorm_1.Entity)('questions')
], Question);
//# sourceMappingURL=question.entity.js.map