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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FaqsService } from './faqs.service';

@ApiTags('FAQs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('faqs')
export class FaqsController {
  constructor(private faqsService: FaqsService) {}

  @Get()
  async findAll(@Query('category') category?: string) {
    return this.faqsService.findAll(category);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.faqsService.findOne(id);
  }

  @Post()
  async create(
    @Body()
    data: {
      question: string;
      answer: string;
      category?: string;
      order?: number;
    },
  ) {
    return this.faqsService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { question?: string; answer?: string; category?: string; order?: number },
  ) {
    return this.faqsService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.faqsService.remove(id);
  }
}