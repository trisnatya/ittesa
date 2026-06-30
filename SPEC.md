# ITESSA Application Specification

## 1. Project Overview

**Project Name:** ITESSA (IT Employee Self Service Application)

**Type:** Full-stack web application with ReactJS frontend and NestJS backend

**Core Functionality:** Employee self-service portal for managing employee data, requests (DPLK, Housing, Administration Later, HC Communication), FAQ, and administrative management functions.

## 2. Technology Stack

### Frontend
- **Framework:** ReactJS 18+ with Vite
- **UI Library:** Tailwind CSS + shadcn/ui
- **State Management:** React Query + Zustand
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form + Zod
- **Table:** TanStack Table
- **File Upload:** react-dropzone
- **Icons:** Lucide React
- **Charts:** Recharts (for Dashboard)

### Backend
- **Framework:** NestJS 10+
- **Database:** PostgreSQL with TypeORM
- **Authentication:** JWT with Passport
- **File Storage:** Local storage with multer
- **Validation:** class-validator
- **API Documentation:** Swagger/OpenAPI

## 3. Database Schema

### Users Table
```
users:
  - id: UUID (PK)
  - email: VARCHAR(255) UNIQUE
  - password: VARCHAR(255)
  - fullName: VARCHAR(255)
  - roleId: UUID (FK -> roles)
  - isActive: BOOLEAN
  - createdAt: TIMESTAMP
  - updatedAt: TIMESTAMP
```

### Roles Table
```
roles:
  - id: UUID (PK)
  - name: VARCHAR(50) UNIQUE (admin, user, hr)
  - permissions: JSONB
  - createdAt: TIMESTAMP
  - updatedAt: TIMESTAMP
```

### Employees Table
```
employees:
  - id: UUID (PK)
  - nik: VARCHAR(50) UNIQUE
  - fullName: VARCHAR(255)
  - email: VARCHAR(255)
  - directorate: VARCHAR(100)
  - unit: VARCHAR(100)
  - position: VARCHAR(100)
  - cvFilePath: VARCHAR(500)
  - status: ENUM('draft', 'submitted', 'done', 'rejected')
  - milestoneStatus: ENUM('draft', 'submitted', 'done', 'rejected')
  - createdBy: UUID (FK -> users)
  - createdAt: TIMESTAMP
  - updatedAt: TIMESTAMP
```

### Request Types Table
```
request_types:
  - id: UUID (PK)
  - name: VARCHAR(100) (DPLK, Housing, Administration Later, HC Communication)
  - description: TEXT
  - createdAt: TIMESTAMP
```

### Requests Table
```
requests:
  - id: UUID (PK)
  - requestTypeId: UUID (FK -> request_types)
  - userId: UUID (FK -> users)
  - employeeId: UUID (FK -> employees)
  - subject: VARCHAR(255)
  - description: TEXT
  - templateId: UUID (FK -> templates)
  - filePath: VARCHAR(500)
  - status: ENUM('draft', 'submitted', 'complete', 'rejected')
  - createdAt: TIMESTAMP
  - updatedAt: TIMESTAMP
  - reviewedBy: UUID (FK -> users)
  - reviewedAt: TIMESTAMP
```

### Templates Table
```
templates:
  - id: UUID (PK)
  - requestTypeId: UUID (FK -> request_types)
  - name: VARCHAR(255)
  - filePath: VARCHAR(500)
  - description: TEXT
  - createdAt: TIMESTAMP
  - updatedAt: TIMESTAMP
```

### Email Templates Table
```
email_templates:
  - id: UUID (PK)
  - name: VARCHAR(255)
  - subject: VARCHAR(255)
  - body: TEXT
  - createdAt: TIMESTAMP
  - updatedAt: TIMESTAMP
```

### FAQs Table
```
faqs:
  - id: UUID (PK)
  - question: TEXT
  - answer: TEXT
  - category: VARCHAR(100)
  - order: INTEGER
  - isActive: BOOLEAN
  - createdAt: TIMESTAMP
  - updatedAt: TIMESTAMP
```

### Questions Table
```
questions:
  - id: UUID (PK)
  - userId: UUID (FK -> users)
  - question: TEXT
  - answer: TEXT
  - status: ENUM('pending', 'answered')
  - createdAt: TIMESTAMP
  - answeredAt: TIMESTAMP
```

### User Logs Table
```
user_logs:
  - id: UUID (PK)
  - userId: UUID (FK -> users)
  - action: VARCHAR(100)
  - module: VARCHAR(100)
  - details: JSONB
  - ipAddress: VARCHAR(50)
  - createdAt: TIMESTAMP
```

## 4. Frontend Structure

### Layout
- **Sidebar:** Fixed left sidebar with navigation menu
- **Header:** Top bar with user info and notifications
- **Content:** Main content area with breadcrumbs

### Pages Structure

#### 1. Dashboard
- Overview statistics cards (total employees, pending requests, etc.)
- Charts showing request distribution by type
- Recent activity feed

#### 2. Employee Menu
- **Table with tabs:** Draft, Submitted, Done, Rejected
- **Columns:** NIK, Full Name, Directorate, Unit, CV File, Status, Actions
- **Actions:** View Detail, Export
- **Filters:** Search by name/NIK, filter by unit

#### 3. View Request Menu
- **Type Tabs:** DPLK, Housing, Administration Later, HC Communication
- **Status Sub-tabs:** Draft, Submitted, Complete, Rejected
- **Template Management Button** (per type)
- **Create Request Modal** with template selection and file upload
- **Actions:** View Detail, Update Status (admin)

#### 4. Template Management (Modal)
- List of templates per request type
- Add/Edit/Delete template
- File upload (DOCX only)

#### 5. FAQ Menu
- List of FAQs with categories
- Add/Edit/Delete FAQ (admin only)
- Search functionality

#### 6. Question Menu
- User questions list
- Ask new question
- Admin can answer questions

#### 7. Management Menu

##### 7.1 User Role
- List of roles with permissions
- Add/Edit/Delete role

##### 7.2 User Management
- User list table
- Add/Edit/Delete user
- Assign role to user

##### 7.3 Template Email
- List of email templates
- Add/Edit/Delete template
- **Send Email** button per template

##### 7.4 User Log
- Activity log table
- Filter by user, action, date range
- Export functionality

## 5. API Endpoints

### Auth
- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/profile
- POST /api/auth/refresh

### Employees
- GET /api/employees
- GET /api/employees/:id
- POST /api/employees
- PUT /api/employees/:id
- DELETE /api/employees/:id
- GET /api/employees/export

### Requests
- GET /api/requests
- GET /api/requests/:id
- POST /api/requests
- PUT /api/requests/:id
- PATCH /api/requests/:id/status
- DELETE /api/requests/:id
- GET /api/requests/by-type/:typeId

### Request Types
- GET /api/request-types
- GET /api/request-types/:id/templates
- POST /api/request-types/:id/templates

### Templates
- GET /api/templates
- GET /api/templates/:id
- POST /api/templates
- PUT /api/templates/:id
- DELETE /api/templates/:id

### Email Templates
- GET /api/email-templates
- GET /api/email-templates/:id
- POST /api/email-templates
- PUT /api/email-templates/:id
- DELETE /api/email-templates/:id
- POST /api/email-templates/:id/send

### FAQs
- GET /api/faqs
- GET /api/faqs/:id
- POST /api/faqs
- PUT /api/faqs/:id
- DELETE /api/faqs/:id

### Questions
- GET /api/questions
- GET /api/questions/:id
- POST /api/questions
- PUT /api/questions/:id/answer
- DELETE /api/questions/:id

### Users
- GET /api/users
- GET /api/users/:id
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id
- PATCH /api/users/:id/role

### Roles
- GET /api/roles
- GET /api/roles/:id
- POST /api/roles
- PUT /api/roles/:id
- DELETE /api/roles/:id

### User Logs
- GET /api/user-logs
- GET /api/user-logs/export

### Dashboard
- GET /api/dashboard/stats

## 6. UI/UX Design

### Color Palette
- **Primary:** #3B82F6 (Blue)
- **Secondary:** #6366F1 (Indigo)
- **Success:** #10B981 (Green)
- **Warning:** #F59E0B (Amber)
- **Error:** #EF4444 (Red)
- **Background:** #F9FAFB (Light Gray)
- **Card Background:** #FFFFFF
- **Sidebar Background:** #1E293B (Dark Slate)
- **Text Primary:** #111827
- **Text Secondary:** #6B7280

### Typography
- **Font Family:** Inter (Google Fonts)
- **Headings:** 600-700 weight
- **Body:** 400-500 weight

### Components
- **Cards:** White background, subtle shadow, rounded corners
- **Tables:** Alternating row colors, hover effects
- **Buttons:** Primary (filled), Secondary (outlined), Ghost
- **Forms:** Floating labels, validation messages
- **Modals:** Centered, backdrop blur

### Icons
- Lucide React icons throughout the application

## 7. Module Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, HR, User)
- Session management

### Employee Management
- CRUD operations for employee records
- CV file upload and viewing
- Milestone status tracking
- Excel/CSV export functionality
- Detail view modal/page

### Request Management
- Multi-type request system
- Template-based request creation
- File upload (DOCX)
- Status workflow (Draft → Submitted → Complete/Rejected)
- Template management per request type

### Email System
- Template-based email composition
- Send email functionality
- Email history tracking

### FAQ & Questions
- Knowledge base management
- Q&A submission and answering
- Category-based organization

### Administrative
- Role management with permissions
- User management
- Activity logging
- Audit trail

## 8. File Structure

### Backend (NestJS)
```
ittesa-backend/
├── src/
│   ├── auth/
│   ├── common/
│   ├── employees/
│   ├── requests/
│   ├── templates/
│   ├── email-templates/
│   ├── faqs/
│   ├── questions/
│   ├── users/
│   ├── roles/
│   ├── user-logs/
│   ├── dashboard/
│   └── main.ts
├── uploads/
├── package.json
└── tsconfig.json
```

### Frontend (ReactJS)
```
ittesa-frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   ├── layouts/
│   └── App.tsx
├── package.json
└── vite.config.ts
```

## 9. Status Workflows

### Employee Status
```
draft → submitted → done
                  ↘ rejected
```

### Request Status
```
draft → submitted → complete
                  ↘ rejected
```

## 10. Acceptance Criteria

1. User can login/logout with JWT authentication
2. Dashboard displays statistics and charts
3. Employee table with tabs works correctly with export
4. Request management with type and status tabs works
5. Template upload for requests works (DOCX only)
6. Email template management with send functionality works
7. FAQ and Question modules are functional
8. User role and management modules work
9. User logs track all activities
10. All forms validate input correctly
11. File uploads work for CV and DOCX files
12. Export functionality works for tables