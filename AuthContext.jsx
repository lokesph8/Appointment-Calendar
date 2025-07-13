import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('clinic_current_user');
        const authToken = localStorage.getItem('clinic_auth_token');
        
        if (savedUser && authToken) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('clinic_current_user');
        localStorage.removeItem('clinic_auth_token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Get all users from localStorage
  const getUsers = () => {
    try {
      const users = localStorage.getItem('clinic_users');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  };

  // Save users to localStorage
  const saveUsers = (users) => {
    try {
      localStorage.setItem('clinic_users', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  };

  // Generate a simple auth token
  const generateAuthToken = (username) => {
    return btoa(`${username}_${Date.now()}_${Math.random()}`);
  };

  // Hash password (simple implementation - in production use proper hashing)
  const hashPassword = (password) => {
    // Simple hash function - in production, use bcrypt or similar
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  };

  // Signup function
  const signup = async (username, email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const users = getUsers();
          
          // Check if username already exists
          const existingUser = users.find(user => 
            user.username.toLowerCase() === username.toLowerCase()
          );
          
          if (existingUser) {
            resolve({ success: false, error: 'Username already exists' });
            return;
          }

          // Check if email already exists
          const existingEmail = users.find(user => 
            user.email.toLowerCase() === email.toLowerCase()
          );
          
          if (existingEmail) {
            resolve({ success: false, error: 'Email already registered' });
            return;
          }

          // Create new user
          const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password: hashPassword(password),
            createdAt: new Date().toISOString(),
            role: 'staff'
          };

          // Save user
          users.push(newUser);
          saveUsers(users);

          // Auto-login after signup
          const userData = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
          };

          const authToken = generateAuthToken(username);
          
          localStorage.setItem('clinic_current_user', JSON.stringify(userData));
          localStorage.setItem('clinic_auth_token', authToken);
          
          setUser(userData);
          setIsAuthenticated(true);
          
          resolve({ success: true, user: userData });
        } catch (error) {
          console.error('Signup error:', error);
          resolve({ success: false, error: 'Failed to create account. Please try again.' });
        }
      }, 1000); // Simulate network delay
    });
  };

  // Login function
  const login = async (username, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const users = getUsers();
          
          // Find user by username
          const user = users.find(u => 
            u.username.toLowerCase() === username.toLowerCase()
          );

          if (!user) {
            resolve({ success: false, error: 'Invalid username or password' });
            return;
          }

          // Check password
          const hashedPassword = hashPassword(password);
          if (user.password !== hashedPassword) {
            resolve({ success: false, error: 'Invalid username or password' });
            return;
          }

          // Create user session
          const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          };

          const authToken = generateAuthToken(username);
          
          localStorage.setItem('clinic_current_user', JSON.stringify(userData));
          localStorage.setItem('clinic_auth_token', authToken);
          
          setUser(userData);
          setIsAuthenticated(true);
          
          resolve({ success: true, user: userData });
        } catch (error) {
          console.error('Login error:', error);
          resolve({ success: false, error: 'Login failed. Please try again.' });
        }
      }, 1000); // Simulate network delay
    });
  };

  // Logout function
  const logout = () => {
    try {
      localStorage.removeItem('clinic_current_user');
      localStorage.removeItem('clinic_auth_token');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if user is authenticated
  const checkAuth = () => {
    try {
      const savedUser = localStorage.getItem('clinic_current_user');
      const authToken = localStorage.getItem('clinic_auth_token');
      return !!(savedUser && authToken);
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  };

  // Initialize demo user if no users exist
  useEffect(() => {
    const users = getUsers();
    if (users.length === 0) {
      const demoUser = {
        id: 'demo_user',
        username: 'demo',
        email: 'demo@clinic.com',
        password: hashPassword('demo123'),
        createdAt: new Date().toISOString(),
        role: 'staff'
      };
      saveUsers([demoUser]);
    }
  }, []);

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};