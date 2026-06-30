import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { EmployeesPage } from '@/pages/EmployeesPage';
import { ViewRequestPage } from '@/pages/ViewRequestPage';
import { FAQPage } from '@/pages/FAQPage';
import { QuestionPage } from '@/pages/QuestionPage';
import { UserManagementPage } from '@/pages/UserManagementPage';
import { RoleManagementPage } from '@/pages/RoleManagementPage';
import { EmailTemplatePage } from '@/pages/EmailTemplatePage';
import { UserLogPage } from '@/pages/UserLogPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="requests" element={<ViewRequestPage />} />
        <Route path="faqs" element={<FAQPage />} />
        <Route path="questions" element={<QuestionPage />} />
        <Route path="management/roles" element={<RoleManagementPage />} />
        <Route path="management/users" element={<UserManagementPage />} />
        <Route path="management/email-templates" element={<EmailTemplatePage />} />
        <Route path="management/user-logs" element={<UserLogPage />} />
      </Route>
    </Routes>
  );
}

export default App;