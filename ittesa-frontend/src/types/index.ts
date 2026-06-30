export interface User {
  id: string;
  email: string;
  fullName: string;
  roleId?: string;
  role?: Role;
  isActive: boolean;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Record<string, string[]>;
}

export interface Employee {
  id: string;
  nik: string;
  fullName: string;
  email?: string;
  directorate: string;
  unit: string;
  position?: string;
  phone?: string;
  cvFilePath?: string;
  status: 'draft' | 'submitted' | 'done' | 'rejected';
  createdById?: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export type MilestoneStatus = 'draft' | 'submitted' | 'done' | 'rejected';

export interface RequestType {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Request {
  id: string;
  requestTypeId: string;
  requestType?: RequestType;
  userId: string;
  user?: User;
  employeeId?: string;
  employee?: Employee;
  subject: string;
  description?: string;
  templateId?: string;
  template?: Template;
  filePath?: string;
  status: 'draft' | 'submitted' | 'complete' | 'rejected';
  reviewedById?: string;
  reviewedBy?: User;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  requestTypeId: string;
  requestType?: RequestType;
  name: string;
  filePath: string;
  description?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isActive: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  isActive: boolean;
}

export interface Question {
  id: string;
  userId: string;
  user?: User;
  question: string;
  answer?: string;
  status: 'pending' | 'answered';
  answeredAt?: string;
  createdAt: string;
}

export interface UserLog {
  id: string;
  userId?: string;
  user?: User;
  action: string;
  module: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface DashboardStats {
  employees: {
    total: number;
    byStatus: Record<string, number>;
  };
  requests: {
    total: number;
    byStatus: Record<string, number>;
    byType: Array<{ type: string; count: string }>;
  };
  users: {
    total: number;
  };
  questions: {
    total: number;
    pending: number;
  };
}

export interface AuthResponse {
  access_token: string;
  user: User;
}