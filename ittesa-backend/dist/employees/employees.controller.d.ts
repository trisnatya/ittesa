import { Response } from 'express';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employees.dto';
import { MilestoneStatus } from './employee.entity';
export declare class EmployeesController {
    private employeesService;
    constructor(employeesService: EmployeesService);
    findAll(status?: MilestoneStatus, search?: string): Promise<import("./employee.entity").Employee[]>;
    export(res: Response): Promise<void>;
    findOne(id: string): Promise<import("./employee.entity").Employee>;
    create(createEmployeeDto: CreateEmployeeDto, file: Express.Multer.File, req: any): Promise<import("./employee.entity").Employee>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto, file: Express.Multer.File, req: any): Promise<import("./employee.entity").Employee>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    updateStatus(id: string, status: MilestoneStatus, req: any): Promise<import("./employee.entity").Employee>;
}
