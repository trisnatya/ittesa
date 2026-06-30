import { BaseEntity } from '../common/entities/base.entity';
import { Role } from '../roles/role.entity';
export declare class User extends BaseEntity {
    email: string;
    password: string;
    fullName: string;
    role: Role;
    roleId: string;
    isActive: boolean;
}
