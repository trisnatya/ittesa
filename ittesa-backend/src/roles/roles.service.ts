import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll() {
    return this.roleRepository.find({
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async create(data: { name: string; permissions?: Record<string, any> }) {
    const role = this.roleRepository.create(data);
    return this.roleRepository.save(role);
  }

  async update(id: string, data: Partial<Role>) {
    const role = await this.findOne(id);
    Object.assign(role, data);
    return this.roleRepository.save(role);
  }

  async remove(id: string) {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
    return { message: 'Role deleted successfully' };
  }

  async seed() {
    const count = await this.roleRepository.count();
    if (count === 0) {
      const roles = [
        {
          name: 'admin',
          permissions: {
            dashboard: ['read'],
            employees: ['read', 'create', 'update', 'delete', 'export'],
            requests: ['read', 'create', 'update', 'delete'],
            templates: ['read', 'create', 'update', 'delete'],
            emailTemplates: ['read', 'create', 'update', 'delete', 'send'],
            faqs: ['read', 'create', 'update', 'delete'],
            questions: ['read', 'answer'],
            users: ['read', 'create', 'update', 'delete'],
            roles: ['read', 'create', 'update', 'delete'],
            userLogs: ['read', 'export'],
          },
        },
        {
          name: 'hr',
          permissions: {
            dashboard: ['read'],
            employees: ['read', 'create', 'update', 'export'],
            requests: ['read', 'update'],
            templates: ['read', 'create', 'update', 'delete'],
            emailTemplates: ['read', 'send'],
            faqs: ['read'],
            questions: ['read', 'answer'],
            users: ['read'],
            userLogs: ['read'],
          },
        },
        {
          name: 'user',
          permissions: {
            dashboard: ['read'],
            employees: ['read'],
            requests: ['read', 'create'],
            faqs: ['read'],
            questions: ['read', 'create'],
          },
        },
      ];

      for (const role of roles) {
        await this.create(role);
      }
    }
  }
}