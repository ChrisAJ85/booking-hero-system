
import { Link } from 'react-router-dom';
import { useAuth } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Search, User, PieChart, Brush } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-jobGray text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/9bd772b9-fc9d-467e-b936-39e8438d452d.png" 
            alt="Job Booking System Logo" 
            className="h-8 mr-3"
          />
          <Link to="/dashboard" className="text-xl font-bold text-jobRed">Job Booking System</Link>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="flex items-center hover:text-jobRed">
            <Calendar className="mr-1 h-4 w-4" />
            <span>Jobs</span>
          </Link>
          
          <Link to="/documents" className="flex items-center hover:text-jobRed">
            <FileText className="mr-1 h-4 w-4" />
            <span>Documents</span>
          </Link>
          
          <Link to="/search" className="flex items-center hover:text-jobRed">
            <Search className="mr-1 h-4 w-4" />
            <span>Search</span>
          </Link>
          
          <Link to="/mailmark-data" className="flex items-center hover:text-jobRed">
            <PieChart className="mr-1 h-4 w-4" />
            <span>Mailmark</span>
          </Link>
          
          <Link to="/artwork-submission" className="flex items-center hover:text-jobRed">
            <Brush className="mr-1 h-4 w-4" />
            <span>Artwork</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm">
              <span className="block">{user?.name}</span>
              <span className="block text-xs opacity-75 capitalize">{user?.role}</span>
            </div>
            <Link to="/user-profile" className="hover:opacity-80 transition-opacity">
              {user?.profileImage ? (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback className="bg-jobGray-light">{user?.name?.[0]}</AvatarFallback>
                </Avatar>
              ) : (
                <User className="h-6 w-6 p-1 bg-jobGray-light rounded-full" />
              )}
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-white border-white hover:bg-jobGray-light"
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
