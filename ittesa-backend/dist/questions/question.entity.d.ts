import { BaseEntity } from '../common/entities/base.entity';
import { User } from '../users/user.entity';
export declare enum QuestionStatus {
    PENDING = "pending",
    ANSWERED = "answered"
}
export declare class Question extends BaseEntity {
    user: User;
    userId: string;
    question: string;
    answer: string;
    status: QuestionStatus;
    answeredAt: Date;
}
