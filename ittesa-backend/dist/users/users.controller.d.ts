import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./user.entity").User[]>;
    findOne(id: string): Promise<import("./user.entity").User>;
    create(data: {
        email: string;
        password: string;
        fullName: string;
        roleId?: string;
    }): Promise<import("./user.entity").User>;
    update(id: string, data: {
        fullName?: string;
        password?: string;
        isActive?: boolean;
    }, req: any): Promise<{
        email: string;
        fullName: string;
        role: import("../roles/role.entity").Role;
        roleId: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateRole(id: string, roleId: string, req: any): Promise<import("./user.entity").User>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
