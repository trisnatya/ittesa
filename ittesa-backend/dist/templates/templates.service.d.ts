import { Repository } from 'typeorm';
import { Template } from './template.entity';
export declare class TemplatesService {
    private templateRepository;
    constructor(templateRepository: Repository<Template>);
    findAll(requestTypeId?: string): Promise<Template[]>;
    findOne(id: string): Promise<Template>;
    create(data: {
        requestTypeId: string;
        name: string;
        filePath: string;
        description?: string;
    }): Promise<Template>;
    update(id: string, data: Partial<Template>): Promise<Template>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
