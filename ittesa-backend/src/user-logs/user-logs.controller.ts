import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserLogsService } from './user-logs.service';

@ApiTags('User Logs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('user-logs')
export class UserLogsController {
  constructor(private userLogsService: UserLogsService) {}

  @Get()
  async findAll(
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('module') module?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.userLogsService.findAll({
      userId,
      action,
      module,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('export')
  async export(@Res() res: Response) {
    const logs = await this.userLogsService.findAll();
    
    const headers = ['Date', 'User', 'Action', 'Module', 'Details', 'IP Address'];
    const csvContent = [
      headers.join(','),
      ...logs.map((log) =>
        [
          log.createdAt.toISOString(),
          `"${log.user?.fullName || 'System'}"`,
          log.action,
          log.module,
          `"${JSON.stringify(log.details || {})}".replace(/"/g, '""')`,
          log.ipAddress || '',
        ].join(','),
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=user-logs.csv');
    res.send(csvContent);
  }
}