import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, RequestStatus } from './request.entity';
import { CreateRequestDto, UpdateRequestDto } from './requests.dto';
import { UserLogsService } from '../user-logs/user-logs.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    private userLogsService: UserLogsService,
  ) {}

  async findAll(filters?: {
    requestTypeId?: string;
    status?: RequestStatus;
    userId?: string;
  }) {
    const query = this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.requestType', 'requestType')
      .leftJoinAndSelect('request.user', 'user')
      .leftJoinAndSelect('request.employee', 'employee')
      .leftJoinAndSelect('request.template', 'template');

    if (filters?.requestTypeId) {
      query.andWhere('request.requestTypeId = :requestTypeId', {
        requestTypeId: filters.requestTypeId,
      });
    }

    if (filters?.status) {
      query.andWhere('request.status = :status', { status: filters.status });
    }

    if (filters?.userId) {
      query.andWhere('request.userId = :userId', { userId: filters.userId });
    }

    query.orderBy('request.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string) {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: ['requestType', 'user', 'employee', 'template'],
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }

  async create(createRequestDto: CreateRequestDto, userId: string) {
    const request = this.requestRepository.create({
      ...createRequestDto,
      userId,
    });

    const saved = await this.requestRepository.save(request);

    await this.userLogsService.createLog({
      userId,
      action: 'CREATE',
      module: 'REQUESTS',
      details: { requestId: saved.id, type: createRequestDto.requestTypeId },
    });

    return saved;
  }

  async update(id: string, updateRequestDto: UpdateRequestDto, userId: string) {
    const request = await this.findOne(id);
    Object.assign(request, updateRequestDto);

    const updated = await this.requestRepository.save(request);

    await this.userLogsService.createLog({
      userId,
      action: 'UPDATE',
      module: 'REQUESTS',
      details: { requestId: id },
    });

    return updated;
  }

  async updateStatus(id: string, status: RequestStatus, userId: string) {
    const request = await this.findOne(id);
    request.status = status;
    request.reviewedById = userId;
    request.reviewedAt = new Date();

    const updated = await this.requestRepository.save(request);

    await this.userLogsService.createLog({
      userId,
      action: 'UPDATE_STATUS',
      module: 'REQUESTS',
      details: { requestId: id, newStatus: status },
    });

    return updated;
  }

  async remove(id: string, userId: string) {
    const request = await this.findOne(id);
    await this.requestRepository.remove(request);

    await this.userLogsService.createLog({
      userId,
      action: 'DELETE',
      module: 'REQUESTS',
      details: { requestId: id },
    });

    return { message: 'Request deleted successfully' };
  }
}