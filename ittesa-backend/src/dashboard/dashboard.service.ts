import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee, MilestoneStatus } from '../employees/employee.entity';
import { Request, RequestStatus } from '../requests/request.entity';
import { User } from '../users/user.entity';
import { Question, QuestionStatus } from '../questions/question.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async getStats() {
    const [
      totalEmployees,
      employeesByStatus,
      totalRequests,
      requestsByStatus,
      totalUsers,
      totalQuestions,
      pendingQuestions,
      requestsByType,
    ] = await Promise.all([
      this.employeeRepository.count(),
      this.getEmployeesByStatus(),
      this.requestRepository.count(),
      this.getRequestsByStatus(),
      this.userRepository.count({ where: { isActive: true } }),
      this.questionRepository.count(),
      this.questionRepository.count({ where: { status: QuestionStatus.PENDING } }),
      this.getRequestsByType(),
    ]);

    return {
      employees: {
        total: totalEmployees,
        byStatus: employeesByStatus,
      },
      requests: {
        total: totalRequests,
        byStatus: requestsByStatus,
        byType: requestsByType,
      },
      users: {
        total: totalUsers,
      },
      questions: {
        total: totalQuestions,
        pending: pendingQuestions,
      },
    };
  }

  private async getEmployeesByStatus() {
    const statuses = Object.values(MilestoneStatus);
    const result = {};

    for (const status of statuses) {
      result[status] = await this.employeeRepository.count({
        where: { status },
      });
    }

    return result;
  }

  private async getRequestsByStatus() {
    const statuses = Object.values(RequestStatus);
    const result = {};

    for (const status of statuses) {
      result[status] = await this.requestRepository.count({
        where: { status },
      });
    }

    return result;
  }

  private async getRequestsByType() {
    const result = await this.requestRepository
      .createQueryBuilder('request')
      .leftJoin('request.requestType', 'requestType')
      .select('requestType.name', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('requestType.name')
      .getRawMany();

    return result;
  }
}