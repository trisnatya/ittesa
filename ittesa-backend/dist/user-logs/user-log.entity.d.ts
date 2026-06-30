import { BaseEntity } from '../common/entities/base.entity';
import { User } from '../users/user.entity';
export declare class UserLog extends BaseEntity {
    user: User;
    userId: string;
    action: string;
    module: string;
    details: Record<string, any>;
    ipAddress: string;
}
