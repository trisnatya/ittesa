import { Repository } from 'typeorm';
import { Employee, MilestoneStatus } from './employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employees.dto';
import { UserLogsService } from '../user-logs/user-logs.service';
export declare class EmployeesService {
    private employeeRepository;
    private userLogsService;
    constructor(employeeRepository: Repository<Employee>, userLogsService: UserLogsService);
    findAll(status?: MilestoneStatus, search?: string): Promise<Employee[]>;
    findOne(id: string): Promise<Employee>;
    create(createEmployeeDto: CreateEmployeeDto, userId: string): Promise<Employee>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto, userId: string): Promise<Employee>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    findByStatus(status: MilestoneStatus): Promise<Employee[]>;
    updateStatus(id: string, status: MilestoneStatus, userId: string): Promise<Employee>;
}
