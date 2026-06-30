import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { useAuthStore } from '@/stores/authStore';
import { User } from 'lucide-react';

export function MainLayout() {
  const { user } = useAuthStore();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-800">
            IT Employee Self Service Application
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-800">{user?.fullName || 'User'}</p>
              <p className="text-gray-500">{user?.role?.name || 'User'}</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}