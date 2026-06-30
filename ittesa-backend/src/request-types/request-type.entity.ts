import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

@Entity('request_types')
export class RequestType extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}