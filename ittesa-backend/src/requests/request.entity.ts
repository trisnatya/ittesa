import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { RequestType } from '../request-types/request-type.entity';
import { User } from '../users/user.entity';
import { Employee } from '../employees/employee.entity';
import { Template } from '../templates/template.entity';

export enum RequestStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  COMPLETE = 'complete',
  REJECTED = 'rejected',
}

@Entity('requests')
export class Request extends BaseEntity {
  @ManyToOne(() => RequestType)
  @JoinColumn({ name: 'request_type_id' })
  requestType: RequestType;

  @Column({ name: 'request_type_id', type: 'uuid' })
  requestTypeId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'employee_id', type: 'uuid', nullable: true })
  employeeId: string;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Template, { nullable: true })
  @JoinColumn({ name: 'template_id' })
  template: Template;

  @Column({ name: 'template_id', type: 'uuid', nullable: true })
  templateId: string;

  @Column({ name: 'file_path', type: 'varchar', length: 500, nullable: true })
  filePath: string;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.DRAFT,
  })
  status: RequestStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewedBy: User;

  @Column({ name: 'reviewed_by', type: 'uuid', nullable: true })
  reviewedById: string;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt: Date;
}