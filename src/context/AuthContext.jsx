import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'member@example.com',
    role: 'member',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300',
    joinDate: '2024-01-15',
    subscription: {
      id: 'sub1',
      planId: 'premium',
      memberId: '1',
      startDate: '2024-01-15',
      endDate: '2024-07-15',
      status: 'active',
      autoRenew: true
    },
    assignedTrainer: '2',
    stats: {
      currentWeight: 180,
      goalWeight: 165,
      startWeight: 190
    }
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'trainer@example.com',
    role: 'trainer',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300',
    joinDate: '2023-06-01',
    specialization: ['Weight Training', 'Cardio', 'Nutrition'],
    assignedMembers: ['1', '3'],
    certifications: ['NASM-CPT', 'ACSM-EP']
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
    joinDate: '2023-01-01',
    permissions: ['manage_users', 'manage_plans', 'view_analytics', 'manage_payments']
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
