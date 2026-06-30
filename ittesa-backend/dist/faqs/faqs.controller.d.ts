import { FaqsService } from './faqs.service';
export declare class FaqsController {
    private faqsService;
    constructor(faqsService: FaqsService);
    findAll(category?: string): Promise<import("./faq.entity").Faq[]>;
    findOne(id: string): Promise<import("./faq.entity").Faq>;
    create(data: {
        question: string;
        answer: string;
        category?: string;
        order?: number;
    }): Promise<import("./faq.entity").Faq>;
    update(id: string, data: {
        question?: string;
        answer?: string;
        category?: string;
        order?: number;
    }): Promise<import("./faq.entity").Faq>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
