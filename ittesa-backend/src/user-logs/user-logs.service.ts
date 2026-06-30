import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { UserLog } from './user-log.entity';

export interface CreateLogDto {
  userId?: string;
  action: string;
  module: string;
  details?: Record<string, any>;
  ipAddress?: string;
}

@Injectable()
export class UserLogsService {
  constructor(
    @InjectRepository(UserLog)
    private userLogRepository: Repository<UserLog>,
  ) {}

  async createLog(dto: CreateLogDto) {
    const log = this.userLogRepository.create(dto);
    return this.userLogRepository.save(log);
  }

  async findAll(filters?: {
    userId?: string;
    action?: string;
    module?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const query = this.userLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user');

    if (filters?.userId) {
      query.andWhere('log.userId = :userId', { userId: filters.userId });
    }

    if (filters?.action) {
      query.andWhere('log.action = :action', { action: filters.action });
    }

    if (filters?.module) {
      query.andWhere('log.module = :module', { module: filters.module });
    }

    if (filters?.startDate && filters?.endDate) {
      query.andWhere('log.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    query.orderBy('log.createdAt', 'DESC');

    return query.getMany();
  }
}