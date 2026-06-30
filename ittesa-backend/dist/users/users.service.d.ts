import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserLogsService } from '../user-logs/user-logs.service';
export declare class UsersService {
    private userRepository;
    private userLogsService;
    constructor(userRepository: Repository<User>, userLogsService: UserLogsService);
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    create(data: {
        email: string;
        password: string;
        fullName: string;
        roleId?: string;
    }): Promise<User>;
    update(id: string, data: Partial<User>, userId: string): Promise<{
        email: string;
        fullName: string;
        role: import("../roles/role.entity").Role;
        roleId: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateRole(id: string, roleId: string, userId: string): Promise<User>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
