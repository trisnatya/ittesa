import { Repository } from 'typeorm';
import { UserLog } from './user-log.entity';
export interface CreateLogDto {
    userId?: string;
    action: string;
    module: string;
    details?: Record<string, any>;
    ipAddress?: string;
}
export declare class UserLogsService {
    private userLogRepository;
    constructor(userLogRepository: Repository<UserLog>);
    createLog(dto: CreateLogDto): Promise<UserLog>;
    findAll(filters?: {
        userId?: string;
        action?: string;
        module?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<UserLog[]>;
}
