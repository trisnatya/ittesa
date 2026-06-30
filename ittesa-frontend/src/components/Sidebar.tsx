import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  HelpCircle,
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    path: '/',
  },
  {
    label: 'Employee',
    icon: <Users size={20} />,
    path: '/employees',
  },
  {
    label: 'View Request',
    icon: <FileText size={20} />,
    path: '/requests',
  },
  {
    label: 'FAQ',
    icon: <HelpCircle size={20} />,
    path: '/faqs',
  },
  {
    label: 'Question',
    icon: <MessageSquare size={20} />,
    path: '/questions',
  },
  {
    label: 'Management',
    icon: <Settings size={20} />,
    children: [
      {
        label: 'User Role',
        icon: <Settings size={18} />,
        path: '/management/roles',
      },
      {
        label: 'User Management',
        icon: <Users size={18} />,
        path: '/management/users',
      },
      {
        label: 'Template Email',
        icon: <Mail size={18} />,
        path: '/management/email-templates',
      },
      {
        label: 'User Log',
        icon: <FileText size={18} />,
        path: '/management/user-logs',
      },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Management']);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);

    return (
      <div key={item.label}>
        {hasChildren ? (
          <>
            <button
              onClick={() => toggleExpand(item.label)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors',
                'hover:bg-white/10 text-gray-300 hover:text-white',
                depth > 0 && 'pl-12'
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            {isExpanded && (
              <div className="mt-1">
                {item.children?.map((child) => renderMenuItem(child, depth + 1))}
              </div>
            )}
          </>
        ) : (
          <Link
            to={item.path || '#'}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors',
              isActive(item.path || '')
                ? 'bg-primary-600 text-white'
                : 'text-gray-300 hover:bg-white/10 hover:text-white',
              depth > 0 && 'pl-12'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-screen bg-sidebar flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold text-white">ITESSA</h1>
        <p className="text-xs text-gray-400 mt-1">IT Employee Self Service</p>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">{menuItems.map((item) => renderMenuItem(item))}</nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}