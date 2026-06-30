import { BaseEntity } from '../common/entities/base.entity';
import { RequestType } from '../request-types/request-type.entity';
import { User } from '../users/user.entity';
import { Employee } from '../employees/employee.entity';
import { Template } from '../templates/template.entity';
export declare enum RequestStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    COMPLETE = "complete",
    REJECTED = "rejected"
}
export declare class Request extends BaseEntity {
    requestType: RequestType;
    requestTypeId: string;
    user: User;
    userId: string;
    employee: Employee;
    employeeId: string;
    subject: string;
    description: string;
    template: Template;
    templateId: string;
    filePath: string;
    status: RequestStatus;
    reviewedBy: User;
    reviewedById: string;
    reviewedAt: Date;
}
