import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { User } from '../users/user.entity';

export enum QuestionStatus {
  PENDING = 'pending',
  ANSWERED = 'answered',
}

@Entity('questions')
export class Question extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text', nullable: true })
  answer: string;

  @Column({
    type: 'enum',
    enum: QuestionStatus,
    default: QuestionStatus.PENDING,
  })
  status: QuestionStatus;

  @Column({ name: 'answered_at', type: 'timestamp', nullable: true })
  answeredAt: Date;
}