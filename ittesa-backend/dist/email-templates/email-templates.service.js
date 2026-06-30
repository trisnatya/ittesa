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
exports.EmailTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const email_template_entity_1 = require("./email-template.entity");
let EmailTemplatesService = class EmailTemplatesService {
    constructor(emailTemplateRepository) {
        this.emailTemplateRepository = emailTemplateRepository;
    }
    async findAll() {
        return this.emailTemplateRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const template = await this.emailTemplateRepository.findOne({
            where: { id },
        });
        if (!template) {
            throw new common_1.NotFoundException('Email template not found');
        }
        return template;
    }
    async create(data) {
        const template = this.emailTemplateRepository.create(data);
        return this.emailTemplateRepository.save(template);
    }
    async update(id, data) {
        const template = await this.findOne(id);
        Object.assign(template, data);
        return this.emailTemplateRepository.save(template);
    }
    async remove(id) {
        const template = await this.findOne(id);
        await this.emailTemplateRepository.remove(template);
        return { message: 'Email template deleted successfully' };
    }
    async sendEmail(id, data) {
        const template = await this.findOne(id);
        let subject = template.subject;
        let body = template.body;
        if (data.replacements) {
            Object.entries(data.replacements).forEach(([key, value]) => {
                subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
                body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
            });
        }
        console.log(`[EMAIL] Sending to: ${data.to}`);
        console.log(`[EMAIL] Subject: ${subject}`);
        console.log(`[EMAIL] Body: ${body}`);
        return {
            success: true,
            message: 'Email sent successfully (simulated)',
            details: { to: data.to, subject, body },
        };
    }
};
exports.EmailTemplatesService = EmailTemplatesService;
exports.EmailTemplatesService = EmailTemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(email_template_entity_1.EmailTemplate)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmailTemplatesService);
//# sourceMappingURL=email-templates.service.js.map