import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AuthGuard } from '@nestjs/passport';
import { TemplatesService } from './templates.service';

@ApiTags('Templates')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('templates')
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Get()
  async findAll(@Query('requestTypeId') requestTypeId?: string) {
    return this.templatesService.findAll(requestTypeId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/templates',
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
    @Body() data: { requestTypeId: string; name: string; description?: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('File is required');
    }
    return this.templatesService.create({
      ...data,
      filePath: file.path,
    });
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/templates',
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
    @Body() data: { name?: string; description?: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updateData: any = { ...data };
    if (file) {
      updateData.filePath = file.path;
    }
    return this.templatesService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.templatesService.remove(id);
  }
}