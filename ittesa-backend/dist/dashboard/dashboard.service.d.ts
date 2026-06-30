import { Repository } from 'typeorm';
import { Employee } from '../employees/employee.entity';
import { Request } from '../requests/request.entity';
import { User } from '../users/user.entity';
import { Question } from '../questions/question.entity';
export declare class DashboardService {
    private employeeRepository;
    private requestRepository;
    private userRepository;
    private questionRepository;
    constructor(employeeRepository: Repository<Employee>, requestRepository: Repository<Request>, userRepository: Repository<User>, questionRepository: Repository<Question>);
    getStats(): Promise<{
        employees: {
            total: number;
            byStatus: {};
        };
        requests: {
            total: number;
            byStatus: {};
            byType: any[];
        };
        users: {
            total: number;
        };
        questions: {
            total: number;
            pending: number;
        };
    }>;
    private getEmployeesByStatus;
    private getRequestsByStatus;
    private getRequestsByType;
}
