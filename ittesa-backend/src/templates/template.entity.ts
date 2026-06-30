import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { RequestType } from '../request-types/request-type.entity';

@Entity('templates')
export class Template extends BaseEntity {
  @ManyToOne(() => RequestType)
  @JoinColumn({ name: 'request_type_id' })
  requestType: RequestType;

  @Column({ name: 'request_type_id', type: 'uuid' })
  requestTypeId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'file_path', type: 'varchar', length: 500 })
  filePath: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}