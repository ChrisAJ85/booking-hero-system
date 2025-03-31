
import { LoginHistoryEntry } from '@/utils/auth';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Clock, MapPin } from 'lucide-react';

interface UserLoginHistoryProps {
  loginHistory?: LoginHistoryEntry[];
}

const UserLoginHistory = ({ loginHistory }: UserLoginHistoryProps) => {
  if (!loginHistory || loginHistory.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-md">
        <p className="text-gray-500">No login history available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loginHistory.map((entry, index) => {
            const date = new Date(entry.timestamp);
            const timeAgo = formatDistanceToNow(date, { addSuffix: true });
            
            return (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <div className="font-medium">{timeAgo}</div>
                      <div className="text-xs text-gray-500">
                        {date.toLocaleDateString()} {date.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{entry.deviceInfo}</TableCell>
                <TableCell>
                  <Badge variant="outline">{entry.ipAddress}</Badge>
                </TableCell>
                <TableCell>
                  {entry.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {entry.location}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserLoginHistory;
