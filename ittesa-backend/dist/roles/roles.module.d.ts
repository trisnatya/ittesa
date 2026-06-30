import { OnModuleInit } from '@nestjs/common';
import { RolesService } from './roles.service';
export declare class RolesModule implements OnModuleInit {
    private rolesService;
    constructor(rolesService: RolesService);
    onModuleInit(): Promise<void>;
}
