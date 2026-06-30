import { QuestionsService } from './questions.service';
import { QuestionStatus } from './question.entity';
export declare class QuestionsController {
    private questionsService;
    constructor(questionsService: QuestionsService);
    findAll(status?: QuestionStatus, userId?: string): Promise<import("./question.entity").Question[]>;
    findOne(id: string): Promise<import("./question.entity").Question>;
    create(question: string, req: any): Promise<import("./question.entity").Question>;
    answer(id: string, answer: string): Promise<import("./question.entity").Question>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
