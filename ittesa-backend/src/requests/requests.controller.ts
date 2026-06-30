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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AuthGuard } from '@nestjs/passport';
import { RequestsService } from './requests.service';
import { CreateRequestDto, UpdateRequestDto } from './requests.dto';
import { RequestStatus } from './request.entity';

@ApiTags('Requests')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('requests')
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @Get()
  async findAll(
    @Query('requestTypeId') requestTypeId?: string,
    @Query('status') status?: RequestStatus,
    @Query('userId') userId?: string,
  ) {
    return this.requestsService.findAll({ requestTypeId, status, userId });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/requests',
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(docx)$/)) {
          return callback(new Error('Only DOCX files are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  async create(
    @Body() createRequestDto: CreateRequestDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (file) {
      createRequestDto.filePath = file.path;
    }
    return this.requestsService.create(createRequestDto, req.user.id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/requests',
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(docx)$/)) {
          return callback(new Error('Only DOCX files are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (file) {
      updateRequestDto.filePath = file.path;
    }
    return this.requestsService.update(id, updateRequestDto, req.user.id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: RequestStatus,
    @Request() req,
  ) {
    return this.requestsService.updateStatus(id, status, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.requestsService.remove(id, req.user.id);
  }
}