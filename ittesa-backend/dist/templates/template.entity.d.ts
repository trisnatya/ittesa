import { BaseEntity } from '../common/entities/base.entity';
import { RequestType } from '../request-types/request-type.entity';
export declare class Template extends BaseEntity {
    requestType: RequestType;
    requestTypeId: string;
    name: string;
    filePath: string;
    description: string;
}
