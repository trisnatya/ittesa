import { RequestStatus } from './request.entity';
export declare class CreateRequestDto {
    requestTypeId: string;
    employeeId?: string;
    subject: string;
    description?: string;
    templateId?: string;
    filePath?: string;
    status?: RequestStatus;
}
export declare class UpdateRequestDto {
    employeeId?: string;
    subject?: string;
    description?: string;
    templateId?: string;
    filePath?: string;
    status?: RequestStatus;
}
