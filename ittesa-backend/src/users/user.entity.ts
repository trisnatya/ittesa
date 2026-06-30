import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Role } from '../roles/role.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'role_id', type: 'uuid', nullable: true })
  roleId: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}