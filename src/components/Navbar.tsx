
import { Link } from 'react-router-dom';
import { useAuth } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Search, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-jobBlue text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">Job Booking System</Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="flex items-center hover:text-gray-200">
            <Calendar className="mr-1 h-4 w-4" />
            <span>Jobs</span>
          </Link>
          
          <Link to="/documents" className="flex items-center hover:text-gray-200">
            <FileText className="mr-1 h-4 w-4" />
            <span>Documents</span>
          </Link>
          
          <Link to="/search" className="flex items-center hover:text-gray-200">
            <Search className="mr-1 h-4 w-4" />
            <span>Search</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm">
              <span className="block">{user?.name}</span>
              <span className="block text-xs opacity-75 capitalize">{user?.role}</span>
            </div>
            <User className="h-6 w-6 p-1 bg-jobBlue-light rounded-full" />
            <Button 
              variant="outline" 
              size="sm" 
              className="text-white border-white hover:bg-jobBlue-light"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
