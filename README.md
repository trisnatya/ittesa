# ITESSA - IT Employee Self Service Application

Aplikasi web full-stack untuk manajemen employee self-service dengan ReactJS (frontend) dan NestJS (backend).

## Fitur

### Menu Utama
- **Dashboard** - Statistik dan grafik overview
- **Employee** - Manajemen data karyawan dengan grouping berdasarkan milestone status (Draft, Submitted, Done, Rejected)
- **View Request** - Manajemen request dengan grouping berdasarkan type (DPLK, Housing, Administration Later, HC Communication) dan status
- **FAQ** - Pertanyaan yang sering ditanyakan
- **Question** - Sistem tanya jawab
- **Management**
  - User Role - Manajemen role dan permissions
  - User Management - Manajemen user
  - Template Email - Template email dengan fitur kirim email
  - User Log - Log aktivitas user

## Tech Stack

### Backend
- NestJS 10+
- PostgreSQL dengan TypeORM
- JWT Authentication
- Swagger API Documentation

### Frontend
- ReactJS 18+ dengan Vite
- Tailwind CSS
- TanStack Query
- React Router DOM
- Recharts untuk grafik
- Zustand untuk state management

## Setup

### 1. Clone Repository
```bash
cd /workspace/project/ittesa
```

### 2. Start PostgreSQL
```bash
docker-compose up -d
```

### 3. Setup Backend
```bash
cd ittesa-backend
npm install
cp .env.example .env
npm run build
npm run start:dev
```

### 4. Setup Frontend
```bash
cd ../ittesa-frontend
npm install
cp .env.example .env
npm run dev
```

### 5. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api/docs

## Default Login
- Email: admin@example.com
- Password: password123

## API Endpoints

### Auth
- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/profile

### Dashboard
- GET /api/dashboard/stats

### Employees
- GET /api/employees
- POST /api/employees
- PUT /api/employees/:id
- DELETE /api/employees/:id
- GET /api/employees/export

### Requests
- GET /api/requests
- POST /api/requests
- PUT /api/requests/:id
- PATCH /api/requests/:id/status

### Templates
- GET /api/templates
- POST /api/templates
- PUT /api/templates/:id
- DELETE /api/templates/:id

### Email Templates
- GET /api/email-templates
- POST /api/email-templates
- PUT /api/email-templates/:id
- POST /api/email-templates/:id/send

### FAQs
- GET /api/faqs
- POST /api/faqs
- PUT /api/faqs/:id
- DELETE /api/faqs/:id

### Questions
- GET /api/questions
- POST /api/questions
- PUT /api/questions/:id/answer

### Users
- GET /api/users
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

### Roles
- GET /api/roles
- POST /api/roles
- PUT /api/roles/:id
- DELETE /api/roles/:id

### User Logs
- GET /api/user-logs
- GET /api/user-logs/export

## License
MIT
