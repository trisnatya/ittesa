import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee, MilestoneStatus } from './employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employees.dto';
import { UserLogsService } from '../user-logs/user-logs.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private userLogsService: UserLogsService,
  ) {}

  async findAll(status?: MilestoneStatus, search?: string) {
    const query = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.createdBy', 'createdBy');

    if (status) {
      query.andWhere('employee.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(employee.fullName ILIKE :search OR employee.nik ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    query.orderBy('employee.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async create(createEmployeeDto: CreateEmployeeDto, userId: string) {
    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      createdById: userId,
    });

    const saved = await this.employeeRepository.save(employee);

    await this.userLogsService.createLog({
      userId,
      action: 'CREATE',
      module: 'EMPLOYEES',
      details: { employeeId: saved.id, nik: saved.nik },
    });

    return saved;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto, userId: string) {
    const employee = await this.findOne(id);
    Object.assign(employee, updateEmployeeDto);

    const updated = await this.employeeRepository.save(employee);

    await this.userLogsService.createLog({
      userId,
      action: 'UPDATE',
      module: 'EMPLOYEES',
      details: { employeeId: id },
    });

    return updated;
  }

  async remove(id: string, userId: string) {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);

    await this.userLogsService.createLog({
      userId,
      action: 'DELETE',
      module: 'EMPLOYEES',
      details: { employeeId: id },
    });

    return { message: 'Employee deleted successfully' };
  }

  async findByStatus(status: MilestoneStatus) {
    return this.employeeRepository.find({
      where: { status },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: MilestoneStatus, userId: string) {
    const employee = await this.findOne(id);
    employee.status = status;
    const updated = await this.employeeRepository.save(employee);

    await this.userLogsService.createLog({
      userId,
      action: 'UPDATE_STATUS',
      module: 'EMPLOYEES',
      details: { employeeId: id, newStatus: status },
    });

    return updated;
  }
}