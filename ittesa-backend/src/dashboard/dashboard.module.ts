import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../employees/employee.entity';
import { Request } from '../requests/request.entity';
import { User } from '../users/user.entity';
import { Question } from '../questions/question.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Request, User, Question])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}