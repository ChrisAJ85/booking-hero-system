
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

export type UserRole = 'admin' | 'manager' | 'user';
export type UserStatus = 'active' | 'suspended';

export interface LoginHistoryEntry {
  timestamp: string;
  ipAddress: string;
  deviceInfo: string;
  location?: string;
}

export interface SubClient {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
  businessName: string;
  subClients: SubClient[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string; // Full name (firstName + lastName)
  email: string;
  mobileNumber?: string;
  landlineNumber?: string;
  businessName?: string;
  role: UserRole;
  status: UserStatus; // Added user status field
  profileImage?: string; // Added profile image field
  allowedSubClients?: string[]; // IDs of sub-clients this user can book jobs for
  subClients?: Array<{ id: string; name: string; clientName: string }>; // For fetching user's allowed sub-clients
  loginHistory?: LoginHistoryEntry[]; // Added login history
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const users: User[] = [
  { 
    id: '1', 
    firstName: 'Admin', 
    lastName: 'User', 
    name: 'Admin User', 
    email: 'admin@example.com', 
    mobileNumber: '07700 900123',
    role: 'admin',
    status: 'active',
    loginHistory: [
      {
        timestamp: '2023-10-15T09:30:45Z',
        ipAddress: '192.168.1.1',
        deviceInfo: 'Chrome 98.0, Windows 10',
        location: 'London, UK'
      }
    ]
  },
  { 
    id: '2', 
    firstName: 'Manager', 
    lastName: 'User', 
    name: 'Manager User', 
    email: 'manager@example.com', 
    mobileNumber: '07700 900456',
    businessName: 'Management Ltd',
    role: 'manager',
    status: 'active',
    loginHistory: [
      {
        timestamp: '2023-10-14T14:22:33Z',
        ipAddress: '192.168.1.2',
        deviceInfo: 'Safari 15.0, macOS',
        location: 'Manchester, UK'
      }
    ]
  },
  { 
    id: '3', 
    firstName: 'Regular', 
    lastName: 'User', 
    name: 'Regular User', 
    email: 'user@example.com', 
    mobileNumber: '07700 900789',
    landlineNumber: '01234 567890',
    businessName: 'Client Company Ltd',
    role: 'user',
    status: 'active',
    allowedSubClients: ['1', '2'],
    loginHistory: [
      {
        timestamp: '2023-10-13T11:15:20Z',
        ipAddress: '192.168.1.3',
        deviceInfo: 'Firefox 95.0, Ubuntu Linux',
        location: 'Birmingham, UK'
      }
    ]
  },
];

export const clients: Client[] = [
  {
    id: '1',
    name: 'Main Client Ltd',
    businessName: 'Main Client Business',
    subClients: [
      { id: '1', name: 'Sub Client A' },
      { id: '2', name: 'Sub Client B' }
    ]
  },
  {
    id: '2',
    name: 'Secondary Client Inc',
    businessName: 'Secondary Business Name',
    subClients: [
      { id: '3', name: 'Sub Department 1' },
      { id: '4', name: 'Sub Department 2' }
    ]
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  console.log("AuthProvider rendering");

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('jobSystemUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        
        // Add subClients property to the user based on allowedSubClients
        if (parsedUser.allowedSubClients && parsedUser.allowedSubClients.length > 0) {
          parsedUser.subClients = clients.flatMap(client => 
            client.subClients
              .filter(subclient => parsedUser.allowedSubClients.includes(subclient.id))
              .map(subclient => ({
                id: subclient.id,
                name: subclient.name,
                clientName: client.name
              }))
          );
        } else {
          parsedUser.subClients = [];
        }
        
        // Check for profile image in localStorage (demo implementation)
        const profileImage = localStorage.getItem('userProfileImage');
        if (profileImage) {
          parsedUser.profileImage = profileImage;
        }
        
        setUser(parsedUser);
        console.log("User loaded from localStorage");
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('jobSystemUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Login attempt for:", email);
    // In a real app, this would be an API call
    // For demo purposes, we'll use our mock data
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser && password === 'password') { // Simple password check for demo
      // Check if user is suspended
      if (foundUser.status === 'suspended') {
        toast({
          title: "Account Suspended",
          description: "Your account has been suspended. Please contact an administrator.",
          variant: "destructive"
        });
        return false;
      }
      
      // Add subClients property to the user based on allowedSubClients
      const userWithSubClients = { ...foundUser };
      
      if (userWithSubClients.allowedSubClients && userWithSubClients.allowedSubClients.length > 0) {
        userWithSubClients.subClients = clients.flatMap(client => 
          client.subClients
            .filter(subclient => userWithSubClients.allowedSubClients!.includes(subclient.id))
            .map(subclient => ({
              id: subclient.id,
              name: subclient.name,
              clientName: client.name
            }))
        );
      } else {
        userWithSubClients.subClients = [];
      }
      
      // Add a new login history entry
      const newLoginEntry: LoginHistoryEntry = {
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 255), // Simulated IP for demo
        deviceInfo: getBrowserInfo(),
        location: getRandomLocation() // Simulated location for demo
      };
      
      if (!userWithSubClients.loginHistory) {
        userWithSubClients.loginHistory = [];
      }
      
      userWithSubClients.loginHistory = [
        newLoginEntry,
        ...(userWithSubClients.loginHistory || []).slice(0, 9) // Keep only last 10 entries
      ];
      
      setUser(userWithSubClients);
      localStorage.setItem('jobSystemUser', JSON.stringify(userWithSubClients));
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      return true;
    }
    
    toast({
      title: "Login failed",
      description: "Invalid email or password.",
      variant: "destructive"
    });
    return false;
  };

  const getBrowserInfo = (): string => {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "";
    let osName = "Unknown";
    
    // Extract browser name and version
    if (userAgent.indexOf("Firefox") > -1) {
      browserName = "Firefox";
      browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || "";
    } else if (userAgent.indexOf("Chrome") > -1) {
      browserName = "Chrome";
      browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || "";
    } else if (userAgent.indexOf("Safari") > -1) {
      browserName = "Safari";
      browserVersion = userAgent.match(/Safari\/([0-9.]+)/)?.[1] || "";
    } else if (userAgent.indexOf("Edge") > -1) {
      browserName = "Edge";
      browserVersion = userAgent.match(/Edge\/([0-9.]+)/)?.[1] || "";
    }
    
    // Extract OS name
    if (userAgent.indexOf("Win") > -1) {
      osName = "Windows";
    } else if (userAgent.indexOf("Mac") > -1) {
      osName = "macOS";
    } else if (userAgent.indexOf("Linux") > -1) {
      osName = "Linux";
    } else if (userAgent.indexOf("Android") > -1) {
      osName = "Android";
    } else if (userAgent.indexOf("iOS") > -1) {
      osName = "iOS";
    }
    
    return `${browserName} ${browserVersion}, ${osName}`;
  };
  
  const getRandomLocation = (): string => {
    const locations = [
      "London, UK",
      "Manchester, UK",
      "Birmingham, UK",
      "Edinburgh, UK",
      "Cardiff, UK",
      "Belfast, UK",
      "Glasgow, UK",
      "Liverpool, UK",
      "Bristol, UK",
      "Leeds, UK"
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jobSystemUser');
    // Do not remove profile image on logout for demo purposes
    // In a real app, this would be stored on the server
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    // Role hierarchy: admin > manager > user
    if (user.role === 'admin') return true;
    if (user.role === 'manager' && requiredRole !== 'admin') return true;
    if (user.role === 'user' && requiredRole === 'user') return true;
    
    return false;
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  console.log("Auth context current user:", user?.name || "none");

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
