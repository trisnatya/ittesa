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
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { QuestionsService } from './questions.service';
import { QuestionStatus } from './question.entity';

@ApiTags('Questions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get()
  async findAll(
    @Query('status') status?: QuestionStatus,
    @Query('userId') userId?: string,
  ) {
    return this.questionsService.findAll(status, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @Post()
  async create(@Body('question') question: string, @Request() req) {
    return this.questionsService.create(question, req.user.id);
  }

  @Put(':id/answer')
  async answer(@Param('id') id: string, @Body('answer') answer: string) {
    return this.questionsService.answer(id, answer);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}