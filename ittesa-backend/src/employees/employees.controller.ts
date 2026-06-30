import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employees.dto';
import { MilestoneStatus } from './employee.entity';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Get()
  async findAll(
    @Query('status') status?: MilestoneStatus,
    @Query('search') search?: string,
  ) {
    return this.employeesService.findAll(status, search);
  }

  @Get('export')
  async export(@Res() res: Response) {
    const employees = await this.employeesService.findAll();
    
    const headers = ['NIK', 'Full Name', 'Email', 'Directorate', 'Unit', 'Position', 'Status'];
    const csvContent = [
      headers.join(','),
      ...employees.map((emp) =>
        [
          emp.nik,
          `"${emp.fullName}"`,
          emp.email || '',
          `"${emp.directorate}"`,
          `"${emp.unit}"`,
          emp.position || '',
          emp.status,
        ].join(','),
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=employees.csv');
    res.send(csvContent);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('cvFile', {
      storage: diskStorage({
        destination: './uploads/cv',
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
          return callback(new Error('Only PDF and DOC files are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (file) {
      createEmployeeDto.cvFilePath = file.path;
    }
    return this.employeesService.create(createEmployeeDto, req.user.id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('cvFile', {
      storage: diskStorage({
        destination: './uploads/cv',
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
          return callback(new Error('Only PDF and DOC files are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (file) {
      updateEmployeeDto.cvFilePath = file.path;
    }
    return this.employeesService.update(id, updateEmployeeDto, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.employeesService.remove(id, req.user.id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: MilestoneStatus,
    @Request() req,
  ) {
    return this.employeesService.updateStatus(id, status, req.user.id);
  }
}