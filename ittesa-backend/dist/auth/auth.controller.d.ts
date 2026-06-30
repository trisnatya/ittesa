import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import("../roles/role.entity").Role;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        email: string;
        fullName: string;
        role: import("../roles/role.entity").Role;
        roleId: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfile(req: any): Promise<import("../users/user.entity").User>;
}
