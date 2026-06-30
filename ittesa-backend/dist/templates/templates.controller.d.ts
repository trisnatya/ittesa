import { TemplatesService } from './templates.service';
export declare class TemplatesController {
    private templatesService;
    constructor(templatesService: TemplatesService);
    findAll(requestTypeId?: string): Promise<import("./template.entity").Template[]>;
    findOne(id: string): Promise<import("./template.entity").Template>;
    create(data: {
        requestTypeId: string;
        name: string;
        description?: string;
    }, file: Express.Multer.File): Promise<import("./template.entity").Template>;
    update(id: string, data: {
        name?: string;
        description?: string;
    }, file: Express.Multer.File): Promise<import("./template.entity").Template>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
