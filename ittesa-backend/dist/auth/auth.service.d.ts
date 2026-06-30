import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { LoginDto, RegisterDto } from './auth.dto';
export declare class AuthService {
    private userRepository;
    private roleRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        email: string;
        fullName: string;
        role: Role;
        roleId: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: Role;
        };
    }>;
    getProfile(userId: string): Promise<User>;
}
