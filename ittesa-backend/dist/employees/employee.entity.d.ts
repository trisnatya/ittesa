import { BaseEntity } from '../common/entities/base.entity';
import { User } from '../users/user.entity';
export declare enum MilestoneStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    DONE = "done",
    REJECTED = "rejected"
}
export declare class Employee extends BaseEntity {
    nik: string;
    fullName: string;
    email: string;
    directorate: string;
    unit: string;
    position: string;
    phone: string;
    cvFilePath: string;
    status: MilestoneStatus;
    createdBy: User;
    createdById: string;
}
