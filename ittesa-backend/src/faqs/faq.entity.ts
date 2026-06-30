import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

@Entity('faqs')
export class Faq extends BaseEntity {
  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}