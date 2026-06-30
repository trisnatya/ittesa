import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplate } from './email-template.entity';

@Injectable()
export class EmailTemplatesService {
  constructor(
    @InjectRepository(EmailTemplate)
    private emailTemplateRepository: Repository<EmailTemplate>,
  ) {}

  async findAll() {
    return this.emailTemplateRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const template = await this.emailTemplateRepository.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Email template not found');
    }

    return template;
  }

  async create(data: { name: string; subject: string; body: string }) {
    const template = this.emailTemplateRepository.create(data);
    return this.emailTemplateRepository.save(template);
  }

  async update(id: string, data: Partial<EmailTemplate>) {
    const template = await this.findOne(id);
    Object.assign(template, data);
    return this.emailTemplateRepository.save(template);
  }

  async remove(id: string) {
    const template = await this.findOne(id);
    await this.emailTemplateRepository.remove(template);
    return { message: 'Email template deleted successfully' };
  }

  async sendEmail(
    id: string,
    data: { to: string; replacements?: Record<string, string> },
  ) {
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
}