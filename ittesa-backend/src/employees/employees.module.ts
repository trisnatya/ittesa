import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { User } from '../users/user.entity';
import { UserLogsModule } from '../user-logs/user-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, User]), UserLogsModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}