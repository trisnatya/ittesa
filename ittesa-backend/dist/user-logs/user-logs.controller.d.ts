import { Response } from 'express';
import { UserLogsService } from './user-logs.service';
export declare class UserLogsController {
    private userLogsService;
    constructor(userLogsService: UserLogsService);
    findAll(userId?: string, action?: string, module?: string, startDate?: string, endDate?: string): Promise<import("./user-log.entity").UserLog[]>;
    export(res: Response): Promise<void>;
}
