export interface User {
  id: string;
  email: string;
  fullName: string;
  role?: Role;
  roleId?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface Role {
  id: string;
  name: string;
  permissions?: string[];
  createdAt?: string;
}

export interface Employee {
  id: string;
  nik: string;
  fullName: string;
  directorate: string;
  unit: string;
  cvFile?: string;
  milestoneStatus: 'draft' | 'submitted' | 'done' | 'rejected';
  createdAt?: string;
}

export interface RequestType {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface Request {
  id: string;
  title: string;
  description?: string;
  requestTypeId: string;
  requestType?: RequestType;
  userId?: string;
  milestoneStatus: 'draft' | 'submitted' | 'complete' | 'rejected';
  fileUrl?: string;
  templateId?: string;
  template?: Template;
  createdAt?: string;
  updatedAt?: string;
}

export interface Template {
  id: string;
  name: string;
  requestTypeId: string;
  fileUrl?: string;
  createdAt?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface Question {
  id: string;
  question: string;
  answer?: string;
  userId?: string;
  user?: User;
  createdAt?: string;
}

export interface UserLog {
  id: string;
  userId: string;
  user?: User;
  action: string;
  module: string;
  details?: any;
  createdAt?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
