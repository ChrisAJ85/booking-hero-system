
import React, { useState } from 'react';
import { useAuth } from '@/utils/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would upload the file to a server
      // For now, we'll use a local URL
      const reader = new FileReader();
      reader.onload = (e) => {
        // This is a mock implementation - in a real app, you would make an API call
        // to update the user's profile image in the backend
        if (e.target?.result) {
          // For demo purposes only - in a real app, don't store images in localStorage
          localStorage.setItem('userProfileImage', e.target.result as string);
          
          // Show success message
          toast({
            title: "Profile image updated",
            description: "Your profile image has been updated successfully."
          });
          
          // Force a page refresh to show the new image
          window.location.reload();
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would verify the current password and update to the new one
    // For this demo, we'll simulate success
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully."
    });
    
    // Reset form and close dialog
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsResetDialogOpen(false);
  };
  
  // If user data is not available yet
  if (!user) {
    return <div>Loading...</div>;
  }
  
  // Check for profile image in localStorage (demo only)
  const profileImage = localStorage.getItem('userProfileImage') || undefined;
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">User Profile</CardTitle>
            <CardDescription>View and update your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                {profileImage ? (
                  <Avatar className="h-28 w-28">
                    <AvatarImage src={profileImage} alt={user.name} />
                    <AvatarFallback className="text-3xl">{user.name[0]}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-28 w-28 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-14 w-14 text-gray-400" />
                  </div>
                )}
                <label htmlFor="profile-image" className="absolute -bottom-2 -right-2 bg-primary text-white p-1 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                  <input 
                    id="profile-image" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-gray-500 capitalize">{user.role}</p>
                <p className="text-gray-700 mt-1">{user.email}</p>
                {user.mobileNumber && (
                  <p className="text-gray-700">{user.mobileNumber}</p>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p>{user.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p>{user.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="capitalize">{user.role}</p>
                </div>
                {user.businessName && (
                  <div>
                    <p className="text-sm text-gray-500">Business</p>
                    <p>{user.businessName}</p>
                  </div>
                )}
              </div>
            </div>
            
            {user.loginHistory && user.loginHistory.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recent Login Activity</h3>
                  <div className="max-h-40 overflow-y-auto border rounded-md">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.loginHistory.map((login, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-2 text-sm">
                              {new Date(login.timestamp).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-sm">{login.location || 'Unknown'}</td>
                            <td className="px-4 py-2 text-sm">{login.deviceInfo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
              <DialogTrigger asChild>
                <Button>Reset Password</Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handlePasswordReset}>
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and a new password.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="current-password" className="text-sm font-medium">
                        Current Password
                      </label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="new-password" className="text-sm font-medium">
                        New Password
                      </label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="confirm-password" className="text-sm font-medium">
                        Confirm New Password
                      </label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Update Password</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default UserProfile;
