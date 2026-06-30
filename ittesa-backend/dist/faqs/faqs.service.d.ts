import { Repository } from 'typeorm';
import { Faq } from './faq.entity';
export declare class FaqsService {
    private faqRepository;
    constructor(faqRepository: Repository<Faq>);
    findAll(category?: string): Promise<Faq[]>;
    findOne(id: string): Promise<Faq>;
    create(data: {
        question: string;
        answer: string;
        category?: string;
        order?: number;
    }): Promise<Faq>;
    update(id: string, data: Partial<Faq>): Promise<Faq>;
    remove(id: string): Promise<{
        message: string;
    }>;
    seed(): Promise<void>;
}
