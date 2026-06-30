import { RequestsService } from './requests.service';
import { CreateRequestDto, UpdateRequestDto } from './requests.dto';
import { RequestStatus } from './request.entity';
export declare class RequestsController {
    private requestsService;
    constructor(requestsService: RequestsService);
    findAll(requestTypeId?: string, status?: RequestStatus, userId?: string): Promise<import("./request.entity").Request[]>;
    findOne(id: string): Promise<import("./request.entity").Request>;
    create(createRequestDto: CreateRequestDto, file: Express.Multer.File, req: any): Promise<import("./request.entity").Request>;
    update(id: string, updateRequestDto: UpdateRequestDto, file: Express.Multer.File, req: any): Promise<import("./request.entity").Request>;
    updateStatus(id: string, status: RequestStatus, req: any): Promise<import("./request.entity").Request>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
