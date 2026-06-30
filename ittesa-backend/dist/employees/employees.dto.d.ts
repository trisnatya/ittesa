import { MilestoneStatus } from './employee.entity';
export declare class CreateEmployeeDto {
    nik: string;
    fullName: string;
    email?: string;
    directorate: string;
    unit: string;
    position?: string;
    phone?: string;
    cvFilePath?: string;
}
export declare class UpdateEmployeeDto {
    fullName?: string;
    email?: string;
    directorate?: string;
    unit?: string;
    position?: string;
    phone?: string;
    cvFilePath?: string;
    status?: MilestoneStatus;
}
