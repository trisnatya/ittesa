import { RolesService } from './roles.service';
export declare class RolesController {
    private rolesService;
    constructor(rolesService: RolesService);
    findAll(): Promise<import("./role.entity").Role[]>;
    findOne(id: string): Promise<import("./role.entity").Role>;
    create(data: {
        name: string;
        permissions?: Record<string, any>;
    }): Promise<import("./role.entity").Role>;
    update(id: string, data: {
        name?: string;
        permissions?: Record<string, any>;
    }): Promise<import("./role.entity").Role>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
