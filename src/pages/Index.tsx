
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  console.log("Index page rendering");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", email, password);
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-jobGray-lighter">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-jobRed">Job Booking System</h1>
          <p className="text-gray-600 mt-2">Manage jobs, documents, and more</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your email and password to access the system
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-jobRed hover:bg-jobRed-light"
              >
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo Accounts (password: password)</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setEmail('admin@example.com');
                setPassword('password');
              }}
            >
              Admin
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setEmail('manager@example.com');
                setPassword('password');
              }}
            >
              Manager
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setEmail('user@example.com');
                setPassword('password');
              }}
            >
              User
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
