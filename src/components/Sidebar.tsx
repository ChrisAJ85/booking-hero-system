
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, FileText, LayoutDashboard, Search, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/utils/auth';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/dashboard',
      allowed: true
    },
    {
      name: 'Documents',
      icon: <FileText className="h-5 w-5" />,
      path: '/documents',
      allowed: true
    },
    {
      name: 'Search Jobs',
      icon: <Search className="h-5 w-5" />,
      path: '/search',
      allowed: true
    },
    {
      name: 'User Management',
      icon: <Users className="h-5 w-5" />,
      path: '/users',
      allowed: isAdmin()
    }
  ];

  return (
    <div className="w-64 bg-jobGray-light border-r border-jobGray min-h-screen">
      <div className="flex flex-col p-4">
        <div className="py-6 px-4 text-center">
          <h2 className="text-xl font-bold text-jobBlue">Job System</h2>
          <div className="mt-2 text-sm text-jobGray-dark">
            <div className="flex items-center justify-center">
              <User className="h-4 w-4 mr-1" />
              <span>{user?.name}</span>
            </div>
            <div className="capitalize mt-1">{user?.role}</div>
          </div>
        </div>

        <div className="space-y-1">
          {navItems
            .filter(item => item.allowed)
            .map(item => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-sm rounded-md",
                  location.pathname === item.path
                    ? "bg-jobBlue text-white"
                    : "text-jobGray-dark hover:bg-jobGray hover:text-jobBlue"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
        </div>

        <div className="mt-auto pt-6 border-t border-jobGray mt-6">
          <div className="text-xs text-jobGray-dark">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 mr-1" />
              <span>Recent Activity</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Calendar className="h-3 w-3 mr-1 mt-1 text-jobBlue" />
                <span>New job created</span>
              </li>
              <li className="flex items-start">
                <Calendar className="h-3 w-3 mr-1 mt-1 text-jobBlue" />
                <span>Document uploaded</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
