
import { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import SubClientSelector from './SubClientSelector';
import { UserRole, UserStatus } from '@/utils/auth';

interface SubClientWithClient {
  id: string;
  name: string;
  clientName: string;
}

interface Client {
  id: string;
  name: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  landlineNumber: string;
  businessName: string;
  role: UserRole;
  status: UserStatus;
  allowedSubClients: string[];
}

interface UserFormProps {
  formData: FormData;
  subClients: SubClientWithClient[];
  clients?: Client[];
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (value: string) => void;
  onSubClientChange: (subClientId: string, isChecked: boolean) => void;
  onAddNewSubClient?: (name: string, clientId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const UserForm = ({
  formData,
  subClients,
  clients = [],
  onInputChange,
  onRoleChange,
  onSubClientChange,
  onAddNewSubClient,
  onSubmit,
  onCancel,
  isEditing
}: UserFormProps) => {
  const handleStatusChange = (value: string) => {
    const event = {
      target: {
        name: 'status',
        value: value
      }
    } as ChangeEvent<HTMLInputElement>;
    
    onInputChange(event);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={onInputChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={onInputChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onInputChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="mobileNumber" className="text-sm font-medium">
            Mobile Number
          </label>
          <input
            id="mobileNumber"
            name="mobileNumber"
            type="tel"
            value={formData.mobileNumber}
            onChange={onInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="landlineNumber" className="text-sm font-medium">
            Landline Number
          </label>
          <input
            id="landlineNumber"
            name="landlineNumber"
            type="tel"
            value={formData.landlineNumber}
            onChange={onInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="businessName" className="text-sm font-medium">
          Business Name
        </label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          value={formData.businessName}
          onChange={onInputChange}
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">
            Role
          </label>
          <Select
            value={formData.role}
            onValueChange={onRoleChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <Select
            value={formData.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {formData.role === 'user' && (
        <div className="space-y-2">
          <SubClientSelector
            subClients={subClients}
            selectedSubClients={formData.allowedSubClients}
            onChange={onSubClientChange}
            onAddNewSubClient={onAddNewSubClient}
            clients={clients}
          />
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-jobBlue hover:bg-jobBlue-light">
          {isEditing ? 'Update User' : 'Add User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
