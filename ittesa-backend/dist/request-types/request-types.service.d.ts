import { Repository } from 'typeorm';
import { RequestType } from './request-type.entity';
export declare class RequestTypesService {
    private requestTypeRepository;
    constructor(requestTypeRepository: Repository<RequestType>);
    findAll(): Promise<RequestType[]>;
    findOne(id: string): Promise<RequestType>;
    create(data: Partial<RequestType>): Promise<RequestType>;
    update(id: string, data: Partial<RequestType>): Promise<RequestType>;
    remove(id: string): Promise<{
        message: string;
    }>;
    seed(): Promise<void>;
}
