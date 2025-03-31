
import { Link, useLocation } from 'react-router-dom';
import { Building, Calendar, Clock, FileText, LayoutDashboard, Search, User, Users, BookPlus, PieChart, Brush, PlusCircle, FileUp, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/utils/auth';
import { Button } from '@/components/ui/button';

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
      name: 'Mailmark Direct Data',
      icon: <PieChart className="h-5 w-5" />,
      path: '/mailmark-data',
      allowed: true
    },
    {
      name: 'Artwork Submission',
      icon: <Brush className="h-5 w-5" />,
      path: '/artwork-submission',
      allowed: true
    },
    {
      name: 'Artwork Approval',
      icon: <Brush className="h-5 w-5" />,
      path: '/artwork-approval',
      allowed: isAdmin()
    },
    {
      name: 'UCID & SCID Requests',
      icon: <BookPlus className="h-5 w-5" />,
      path: '/ucid-requests',
      allowed: isAdmin()
    },
    {
      name: 'User Management',
      icon: <Users className="h-5 w-5" />,
      path: '/users',
      allowed: isAdmin()
    },
    {
      name: 'Client Management',
      icon: <Building className="h-5 w-5" />,
      path: '/clients',
      allowed: isAdmin()
    }
  ];

  return (
    <div className="w-64 bg-jobGray-lighter border-r border-jobGray min-h-screen">
      <div className="flex flex-col p-4">
        <div className="py-6 px-4 text-center">
          <img 
            src="/lovable-uploads/9bd772b9-fc9d-467e-b936-39e8438d452d.png" 
            alt="Job Booking System Logo" 
            className="h-8 mx-auto mb-2"
          />
          <h2 className="text-xl font-bold text-jobRed">Job System</h2>
          <div className="mt-2 text-sm text-jobGray-dark">
            <div className="flex items-center justify-center">
              <User className="h-4 w-4 mr-1" />
              <span>{user?.name}</span>
            </div>
            <div className="capitalize mt-1">{user?.role}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-2 mb-4 flex flex-col space-y-2 px-2">
          <Button className="w-full flex items-center justify-start bg-jobRed hover:bg-jobRed/90">
            <PlusCircle className="h-4 w-4 mr-2" />
            <span>New Job</span>
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-start text-jobGray-dark border-jobGray-dark hover:bg-jobGray-lighter hover:text-jobRed">
            <FileUp className="h-4 w-4 mr-2" />
            <span>Book via File</span>
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-start text-jobGray-dark border-jobGray-dark hover:bg-jobGray-lighter hover:text-jobRed">
            <File className="h-4 w-4 mr-2" />
            <span>Request New UCID</span>
          </Button>
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
                    ? "bg-jobRed text-white"
                    : "text-jobGray-dark hover:bg-gray-200 hover:text-jobRed"
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
                <Calendar className="h-3 w-3 mr-1 mt-1 text-jobGray" />
                <span>New job created</span>
              </li>
              <li className="flex items-start">
                <Calendar className="h-3 w-3 mr-1 mt-1 text-jobGray" />
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
