import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLog } from './user-log.entity';
import { UserLogsService } from './user-logs.service';
import { UserLogsController } from './user-logs.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserLog])],
  controllers: [UserLogsController],
  providers: [UserLogsService],
  exports: [UserLogsService],
})
export class UserLogsModule {}