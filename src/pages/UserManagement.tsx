import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuth, User, users, UserStatus } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/utils/auth';
import { UserPlus } from 'lucide-react';
import UserTable from '@/components/user/UserTable';
import UserForm from '@/components/user/UserForm';
import { ClientStore } from '@/utils/data';

interface SubClientWithClient {
  clientName: string;
  id: string;
  name: string;
}

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
    status: 'active' as UserStatus,
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

  const clientsList = ClientStore.getClients();
  
  const allSubClients: SubClientWithClient[] = clientsList.flatMap(client => 
    client.subClients.map(subclient => ({
      ...subclient,
      clientName: client.name
    }))
  );

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

  const handleAddNewSubClient = (name: string, clientId: string) => {
    console.log("Adding new sub-client:", name, "for client ID:", clientId);
    
    const newSubClient = ClientStore.addSubClient(clientId, { name });
    
    if (newSubClient) {
      setFormData({
        ...formData,
        allowedSubClients: [...formData.allowedSubClients, newSubClient.id]
      });
      
      toast({
        title: "Sub-Client Added",
        description: "New sub-client has been created and added to selected sub-clients."
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add new sub-client.",
        variant: "destructive"
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
      status: 'active',
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
      status: user.status || 'active',
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
          status: formData.status,
          allowedSubClients: formData.allowedSubClients
        } : u
      );
      
      toast({
        title: "User Updated",
        description: "User has been updated successfully."
      });
    } else {
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
        status: formData.status,
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

  const handleToggleStatus = (userId: string, newStatus: UserStatus) => {
    if (userId === currentUser?.id) {
      toast({
        title: "Cannot Suspend",
        description: "You cannot suspend your own account.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedUsers = usersList.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    );
    
    setUsersList(updatedUsers);
    
    toast({
      title: newStatus === 'active' ? "User Activated" : "User Suspended",
      description: `User has been ${newStatus === 'active' ? 'activated' : 'suspended'} successfully.`
    });
  };

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
                  
                  <UserForm 
                    formData={formData}
                    subClients={allSubClients}
                    clients={clientsList}
                    onInputChange={handleInputChange}
                    onRoleChange={handleRoleChange}
                    onSubClientChange={handleSubClientChange}
                    onAddNewSubClient={handleAddNewSubClient}
                    onSubmit={handleSubmit}
                    onCancel={() => setDialogOpen(false)}
                    isEditing={!!editingUser}
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <UserTable 
                users={usersList}
                currentUserId={currentUser?.id}
                allSubClients={allSubClients}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
                onToggleStatus={handleToggleStatus}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
