import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private userRepository;
    constructor(userRepository: Repository<User>);
    validate(payload: any): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import("../roles/role.entity").Role;
    }>;
}
export {};
