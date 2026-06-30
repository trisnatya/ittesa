import { RequestTypesService } from './request-types.service';
export declare class RequestTypesController {
    private requestTypesService;
    constructor(requestTypesService: RequestTypesService);
    findAll(): Promise<import("./request-type.entity").RequestType[]>;
    findOne(id: string): Promise<import("./request-type.entity").RequestType>;
    create(data: {
        name: string;
        description?: string;
    }): Promise<import("./request-type.entity").RequestType>;
    update(id: string, data: {
        name?: string;
        description?: string;
    }): Promise<import("./request-type.entity").RequestType>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
