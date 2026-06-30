import { EmailTemplatesService } from './email-templates.service';
export declare class EmailTemplatesController {
    private emailTemplatesService;
    constructor(emailTemplatesService: EmailTemplatesService);
    findAll(): Promise<import("./email-template.entity").EmailTemplate[]>;
    findOne(id: string): Promise<import("./email-template.entity").EmailTemplate>;
    create(data: {
        name: string;
        subject: string;
        body: string;
    }): Promise<import("./email-template.entity").EmailTemplate>;
    update(id: string, data: {
        name?: string;
        subject?: string;
        body?: string;
    }): Promise<import("./email-template.entity").EmailTemplate>;
    remove(id: string): Promise<{
        message: string;
    }>;
    send(id: string, data: {
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
