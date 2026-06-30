import { Repository } from 'typeorm';
import { Request, RequestStatus } from './request.entity';
import { CreateRequestDto, UpdateRequestDto } from './requests.dto';
import { UserLogsService } from '../user-logs/user-logs.service';
export declare class RequestsService {
    private requestRepository;
    private userLogsService;
    constructor(requestRepository: Repository<Request>, userLogsService: UserLogsService);
    findAll(filters?: {
        requestTypeId?: string;
        status?: RequestStatus;
        userId?: string;
    }): Promise<Request[]>;
    findOne(id: string): Promise<Request>;
    create(createRequestDto: CreateRequestDto, userId: string): Promise<Request>;
    update(id: string, updateRequestDto: UpdateRequestDto, userId: string): Promise<Request>;
    updateStatus(id: string, status: RequestStatus, userId: string): Promise<Request>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
