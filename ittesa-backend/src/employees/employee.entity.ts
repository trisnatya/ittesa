import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { User } from '../users/user.entity';

export enum MilestoneStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  DONE = 'done',
  REJECTED = 'rejected',
}

@Entity('employees')
export class Employee extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  nik: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  directorate: string;

  @Column({ type: 'varchar', length: 100 })
  unit: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  position: string;

  @Column({ name: 'phone', type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ name: 'cv_file_path', type: 'varchar', length: 500, nullable: true })
  cvFilePath: string;

  @Column({
    type: 'enum',
    enum: MilestoneStatus,
    default: MilestoneStatus.DRAFT,
  })
  status: MilestoneStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdById: string;
}