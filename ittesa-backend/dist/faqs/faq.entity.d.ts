import { BaseEntity } from '../common/entities/base.entity';
export declare class Faq extends BaseEntity {
    question: string;
    answer: string;
    category: string;
    order: number;
    isActive: boolean;
}
