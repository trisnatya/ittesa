import { Repository } from 'typeorm';
import { Question, QuestionStatus } from './question.entity';
export declare class QuestionsService {
    private questionRepository;
    constructor(questionRepository: Repository<Question>);
    findAll(status?: QuestionStatus, userId?: string): Promise<Question[]>;
    findOne(id: string): Promise<Question>;
    create(question: string, userId: string): Promise<Question>;
    answer(id: string, answer: string): Promise<Question>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
