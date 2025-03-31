
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuth, User, users, Client, clients } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/utils/auth';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, UserPlus, UserCog, UserX, ChevronDown } from 'lucide-react';

const UserManagement = () => {
  const { user: currentUser, isAdmin } = useAuth();
  const [usersList, setUsersList] = useState<User[]>(users);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    landlineNumber: '',
    businessName: '',
    role: 'user' as UserRole,
    allowedSubClients: [] as string[]
  });

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 bg-jobGray-light p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Access Denied</h1>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p>You don't have permission to access this page.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as UserRole
    });
  };

  const handleSubClientChange = (subClientId: string, isChecked: boolean) => {
    if (isChecked) {
      setFormData({
        ...formData,
        allowedSubClients: [...(formData.allowedSubClients || []), subClientId]
      });
    } else {
      setFormData({
        ...formData,
        allowedSubClients: (formData.allowedSubClients || []).filter(id => id !== subClientId)
      });
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      landlineNumber: '',
      businessName: '',
      role: 'user',
      allowedSubClients: []
    });
    setEditingUser(null);
  };

  const handleAddUser = () => {
    setDialogOpen(true);
    resetForm();
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      mobileNumber: user.mobileNumber || '',
      landlineNumber: user.landlineNumber || '',
      businessName: user.businessName || '',
      role: user.role,
      allowedSubClients: user.allowedSubClients || []
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Form Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`;
    let updatedUsers: User[];
    
    if (editingUser) {
      // Edit existing user
      updatedUsers = usersList.map(u => 
        u.id === editingUser.id ? { 
          ...u, 
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: fullName,
          email: formData.email, 
          mobileNumber: formData.mobileNumber,
          landlineNumber: formData.landlineNumber,
          businessName: formData.businessName,
          role: formData.role,
          allowedSubClients: formData.allowedSubClients
        } : u
      );
      
      toast({
        title: "User Updated",
        description: "User has been updated successfully."
      });
    } else {
      // Add new user
      const newUser: User = {
        id: `${usersList.length + 1}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        landlineNumber: formData.landlineNumber,
        businessName: formData.businessName,
        role: formData.role,
        allowedSubClients: formData.allowedSubClients
      };
      
      updatedUsers = [...usersList, newUser];
      
      toast({
        title: "User Added",
        description: "User has been added successfully."
      });
    }
    
    setUsersList(updatedUsers);
    setDialogOpen(false);
    resetForm();
  };

  const handleDeleteUser = (userId: string) => {
    // Prevent deleting yourself
    if (userId === currentUser?.id) {
      toast({
        title: "Cannot Delete",
        description: "You cannot delete your own account.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedUsers = usersList.filter(u => u.id !== userId);
    setUsersList(updatedUsers);
    
    toast({
      title: "User Deleted",
      description: "User has been deleted successfully."
    });
  };

  // Get all available subclients from all clients
  const allSubClients = clients.flatMap(client => 
    client.subClients.map(subclient => ({
      ...subclient,
      clientName: client.name
    }))
  );

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 bg-jobGray-light p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-jobBlue hover:bg-jobBlue-light" onClick={handleAddUser}>
                    <UserPlus className="mr-2 h-4 w-4" /> Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name*</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name*</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address*</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Mobile Number</Label>
                        <Input
                          id="mobileNumber"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="landlineNumber">Landline Number</Label>
                        <Input
                          id="landlineNumber"
                          name="landlineNumber"
                          value={formData.landlineNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select defaultValue={formData.role} onValueChange={handleRoleChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {formData.role === 'user' && (
                      <div className="space-y-2">
                        <Label>Can book jobs for sub-clients</Label>
                        <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                          {allSubClients.length > 0 ? (
                            <div className="space-y-2">
                              {allSubClients.map(subclient => (
                                <div key={subclient.id} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`subclient-${subclient.id}`}
                                    checked={formData.allowedSubClients?.includes(subclient.id)}
                                    onCheckedChange={(checked) => 
                                      handleSubClientChange(subclient.id, checked === true)
                                    }
                                  />
                                  <Label 
                                    htmlFor={`subclient-${subclient.id}`}
                                    className="text-sm font-normal cursor-pointer"
                                  >
                                    {subclient.name} <span className="text-xs text-gray-500">({subclient.clientName})</span>
                                  </Label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No sub-clients available</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-jobBlue hover:bg-jobBlue-light">
                        {editingUser ? 'Update User' : 'Add User'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersList.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.businessName || '-'}</TableCell>
                      <TableCell>
                        {user.mobileNumber && <div className="text-sm">{user.mobileNumber}</div>}
                        {user.landlineNumber && <div className="text-sm text-gray-500">{user.landlineNumber}</div>}
                      </TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditUser(user)}
                          >
                            <UserCog className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-500 border-red-200 hover:bg-red-50"
                                disabled={user.id === currentUser?.id}
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
                                  onClick={() => handleDeleteUser(user.id)}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
