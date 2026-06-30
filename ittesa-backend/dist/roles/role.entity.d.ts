import { BaseEntity } from '../common/entities/base.entity';
export declare class Role extends BaseEntity {
    name: string;
    permissions: Record<string, any>;
}
