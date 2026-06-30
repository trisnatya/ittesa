import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, QuestionStatus } from './question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async findAll(status?: QuestionStatus, userId?: string) {
    const query = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.user', 'user');

    if (status) {
      query.andWhere('question.status = :status', { status });
    }

    if (userId) {
      query.andWhere('question.userId = :userId', { userId });
    }

    query.orderBy('question.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string) {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async create(question: string, userId: string) {
    const newQuestion = this.questionRepository.create({
      question,
      userId,
      status: QuestionStatus.PENDING,
    });
    return this.questionRepository.save(newQuestion);
  }

  async answer(id: string, answer: string) {
    const question = await this.findOne(id);
    question.answer = answer;
    question.status = QuestionStatus.ANSWERED;
    question.answeredAt = new Date();
    return this.questionRepository.save(question);
  }

  async remove(id: string) {
    const question = await this.findOne(id);
    await this.questionRepository.remove(question);
    return { message: 'Question deleted successfully' };
  }
}