
import React from 'react';
import { UserRole } from '@/utils/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SubClientSelector from './SubClientSelector';

interface SubClientWithClient {
  id: string;
  name: string;
  clientName: string;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  landlineNumber: string;
  businessName: string;
  role: UserRole;
  allowedSubClients: string[];
}

interface UserFormProps {
  formData: UserFormData;
  subClients: SubClientWithClient[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (value: string) => void;
  onSubClientChange: (subClientId: string, isChecked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const UserForm = ({
  formData,
  subClients,
  onInputChange,
  onRoleChange,
  onSubClientChange,
  onSubmit,
  onCancel,
  isEditing
}: UserFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name*</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name*</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
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
          onChange={onInputChange}
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
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="landlineNumber">Landline Number</Label>
          <Input
            id="landlineNumber"
            name="landlineNumber"
            value={formData.landlineNumber}
            onChange={onInputChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name</Label>
        <Input
          id="businessName"
          name="businessName"
          value={formData.businessName}
          onChange={onInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Role</Label>
        <Select defaultValue={formData.role} onValueChange={onRoleChange}>
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
        <SubClientSelector 
          subClients={subClients}
          selectedSubClients={formData.allowedSubClients}
          onChange={onSubClientChange}
        />
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
