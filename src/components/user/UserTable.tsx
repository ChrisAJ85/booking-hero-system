
import { useState } from 'react';
import { User, UserStatus } from '@/utils/auth';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCog, UserX, UserCheck } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

interface SubClientWithClient {
  id: string;
  name: string;
  clientName: string;
}

interface UserTableProps {
  users: User[];
  currentUserId: string | undefined;
  allSubClients: SubClientWithClient[];
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onToggleStatus: (userId: string, newStatus: UserStatus) => void;
}

const UserTable = ({ 
  users, 
  currentUserId, 
  allSubClients, 
  onEditUser, 
  onDeleteUser,
  onToggleStatus
}: UserTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Business</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Sub-Clients</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id} className={user.status === 'suspended' ? 'bg-gray-50' : ''}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.businessName || '-'}</TableCell>
            <TableCell>
              {user.mobileNumber && <div className="text-sm">{user.mobileNumber}</div>}
              {user.landlineNumber && <div className="text-sm text-gray-500">{user.landlineNumber}</div>}
            </TableCell>
            <TableCell className="capitalize">{user.role}</TableCell>
            <TableCell>
              <Badge 
                variant={user.status === 'active' ? 'default' : 'secondary'}
                className={user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
              >
                {user.status === 'active' ? 'Active' : 'Suspended'}
              </Badge>
            </TableCell>
            <TableCell>
              {user.role === 'user' && user.allowedSubClients && user.allowedSubClients.length > 0 ? (
                <div className="text-sm">
                  {user.allowedSubClients.map(subClientId => {
                    const subClient = allSubClients.find(sc => sc.id === subClientId);
                    return subClient ? (
                      <div key={subClientId} className="mb-1">
                        {subClient.name} <span className="text-xs text-gray-500">({subClient.clientName})</span>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <span className="text-gray-500">-</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onEditUser(user)}
                  disabled={user.id === currentUserId}
                >
                  <UserCog className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className={user.status === 'active' 
                    ? "text-amber-500 border-amber-200 hover:bg-amber-50" 
                    : "text-green-500 border-green-200 hover:bg-green-50"}
                  onClick={() => onToggleStatus(
                    user.id, 
                    user.status === 'active' ? 'suspended' : 'active'
                  )}
                  disabled={user.id === currentUserId}
                >
                  {user.status === 'active' 
                    ? <UserX className="h-4 w-4" /> 
                    : <UserCheck className="h-4 w-4" />}
                  <span className="sr-only">
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </span>
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      disabled={user.id === currentUserId}
                    >
                      <UserX className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the user {user.name}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDeleteUser(user.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
