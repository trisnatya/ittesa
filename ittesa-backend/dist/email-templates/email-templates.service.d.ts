import { Repository } from 'typeorm';
import { EmailTemplate } from './email-template.entity';
export declare class EmailTemplatesService {
    private emailTemplateRepository;
    constructor(emailTemplateRepository: Repository<EmailTemplate>);
    findAll(): Promise<EmailTemplate[]>;
    findOne(id: string): Promise<EmailTemplate>;
    create(data: {
        name: string;
        subject: string;
        body: string;
    }): Promise<EmailTemplate>;
    update(id: string, data: Partial<EmailTemplate>): Promise<EmailTemplate>;
    remove(id: string): Promise<{
        message: string;
    }>;
    sendEmail(id: string, data: {
        to: string;
        replacements?: Record<string, string>;
    }): Promise<{
        success: boolean;
        message: string;
        details: {
            to: string;
            subject: string;
            body: string;
        };
    }>;
}
