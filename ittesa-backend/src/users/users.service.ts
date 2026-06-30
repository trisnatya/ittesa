import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { UserLogsService } from '../user-logs/user-logs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userLogsService: UserLogsService,
  ) {}

  async findAll() {
    return this.userRepository.find({
      relations: ['role'],
      select: ['id', 'email', 'fullName', 'isActive', 'roleId', 'role', 'createdAt'],
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(data: {
    email: string;
    password: string;
    fullName: string;
    roleId?: string;
  }) {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async update(id: string, data: Partial<User>, userId: string) {
    const user = await this.findOne(id);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    Object.assign(user, data);
    const updated = await this.userRepository.save(user);

    await this.userLogsService.createLog({
      userId,
      action: 'UPDATE',
      module: 'USERS',
      details: { targetUserId: id },
    });

    const { password, ...result } = updated;
    return result;
  }

  async updateRole(id: string, roleId: string, userId: string) {
    const user = await this.findOne(id);
    user.roleId = roleId;
    const updated = await this.userRepository.save(user);

    await this.userLogsService.createLog({
      userId,
      action: 'UPDATE_ROLE',
      module: 'USERS',
      details: { targetUserId: id, newRoleId: roleId },
    });

    return updated;
  }

  async remove(id: string, userId: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);

    await this.userLogsService.createLog({
      userId,
      action: 'DELETE',
      module: 'USERS',
      details: { targetUserId: id },
    });

    return { message: 'User deleted successfully' };
  }
}