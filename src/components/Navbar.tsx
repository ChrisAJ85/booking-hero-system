
import { Link } from 'react-router-dom';
import { useAuth } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
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
        </div>
        
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
            className="text-jobGray-dark border-jobGray-light hover:bg-jobGray-light"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
