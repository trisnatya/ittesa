import { Repository } from 'typeorm';
import { Role } from './role.entity';
export declare class RolesService {
    private roleRepository;
    constructor(roleRepository: Repository<Role>);
    findAll(): Promise<Role[]>;
    findOne(id: string): Promise<Role>;
    create(data: {
        name: string;
        permissions?: Record<string, any>;
    }): Promise<Role>;
    update(id: string, data: Partial<Role>): Promise<Role>;
    remove(id: string): Promise<{
        message: string;
    }>;
    seed(): Promise<void>;
}
