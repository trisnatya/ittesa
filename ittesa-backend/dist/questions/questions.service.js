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
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const question_entity_1 = require("./question.entity");
let QuestionsService = class QuestionsService {
    constructor(questionRepository) {
        this.questionRepository = questionRepository;
    }
    async findAll(status, userId) {
        const query = this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.user', 'user');
        if (status) {
            query.andWhere('question.status = :status', { status });
        }
        if (userId) {
            query.andWhere('question.userId = :userId', { userId });
        }
        query.orderBy('question.createdAt', 'DESC');
        return query.getMany();
    }
    async findOne(id) {
        const question = await this.questionRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
        }
        return question;
    }
    async create(question, userId) {
        const newQuestion = this.questionRepository.create({
            question,
            userId,
            status: question_entity_1.QuestionStatus.PENDING,
        });
        return this.questionRepository.save(newQuestion);
    }
    async answer(id, answer) {
        const question = await this.findOne(id);
        question.answer = answer;
        question.status = question_entity_1.QuestionStatus.ANSWERED;
        question.answeredAt = new Date();
        return this.questionRepository.save(question);
    }
    async remove(id) {
        const question = await this.findOne(id);
        await this.questionRepository.remove(question);
        return { message: 'Question deleted successfully' };
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map