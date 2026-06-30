import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './request.entity';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { UserLogsModule } from '../user-logs/user-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Request]), UserLogsModule],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}