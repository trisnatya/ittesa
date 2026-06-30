import { BaseEntity } from '../common/entities/base.entity';
export declare class EmailTemplate extends BaseEntity {
    name: string;
    subject: string;
    body: string;
    isActive: boolean;
}
