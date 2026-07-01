import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'employees',
        loadComponent: () => import('./pages/employees/employees.component').then(m => m.EmployeesComponent)
      },
      {
        path: 'requests',
        loadComponent: () => import('./pages/view-request/view-request.component').then(m => m.ViewRequestComponent)
      },
      {
        path: 'faqs',
        loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent)
      },
      {
        path: 'questions',
        loadComponent: () => import('./pages/question/question.component').then(m => m.QuestionComponent)
      },
      {
        path: 'management/roles',
        loadComponent: () => import('./pages/role-management/role-management.component').then(m => m.RoleManagementComponent)
      },
      {
        path: 'management/users',
        loadComponent: () => import('./pages/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'management/email-templates',
        loadComponent: () => import('./pages/email-template/email-template.component').then(m => m.EmailTemplateComponent)
      },
      {
        path: 'management/user-logs',
        loadComponent: () => import('./pages/user-log/user-log.component').then(m => m.UserLogComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
