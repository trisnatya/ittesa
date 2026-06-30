import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { EmailTemplatesService } from './email-templates.service';

@ApiTags('Email Templates')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('email-templates')
export class EmailTemplatesController {
  constructor(private emailTemplatesService: EmailTemplatesService) {}

  @Get()
  async findAll() {
    return this.emailTemplatesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.emailTemplatesService.findOne(id);
  }

  @Post()
  async create(
    @Body() data: { name: string; subject: string; body: string },
  ) {
    return this.emailTemplatesService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { name?: string; subject?: string; body?: string },
  ) {
    return this.emailTemplatesService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.emailTemplatesService.remove(id);
  }

  @Post(':id/send')
  async send(
    @Param('id') id: string,
    @Body() data: { to: string; replacements?: Record<string, string> },
  ) {
    return this.emailTemplatesService.sendEmail(id, data);
  }
}