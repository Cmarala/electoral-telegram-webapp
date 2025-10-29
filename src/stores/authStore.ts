import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ElectoralUser, TelegramUser } from '../types';

// Authentication store interface
interface AuthState {
  // User authentication state
  isAuthenticated: boolean;
  user: ElectoralUser | null;
  telegramUser: TelegramUser | null;
  token: string | null;
  
  // Loading states
  isLoading: boolean;
  isInitializing: boolean;
  
  // Error handling
  error: string | null;
  
  // Actions
  login: (telegramData: any) => Promise<void>;
  logout: () => void;
  initializeTelegramWebApp: () => void;
  updateUser: (userData: Partial<ElectoralUser>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock authentication function (will be replaced with actual tRPC calls)
const mockAuthenticate = async (telegramData: any): Promise<{ user: ElectoralUser; token: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data based on Telegram information
  const mockUser: ElectoralUser = {
    telegramId: telegramData.user?.id || 123456789,
    firstName: telegramData.user?.first_name || 'Electoral',
    lastName: telegramData.user?.last_name || 'Officer',
    username: telegramData.user?.username || 'electoral_officer',
    role: 'constituency_manager', // Default role
    constituency: 'CONSTITUENCY_001', // Default constituency
    permissions: [
      { id: '1', name: 'Read Voters', resource: 'voters', action: 'read' },
      { id: '2', name: 'Update Voters', resource: 'voters', action: 'update' },
      { id: '3', name: 'Create Surveys', resource: 'surveys', action: 'create' },
      { id: '4', name: 'View Analytics', resource: 'analytics', action: 'read' },
    ],
    assignedBooths: [1, 2, 3, 4, 5], // Default booth assignments
    isActive: true,
    lastLogin: new Date(),
  };
  
  return {
    user: mockUser,
    token: 'mock-jwt-token-' + Date.now(),
  };
};

// Create authentication store with persistence
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isAuthenticated: false,
        user: null,
        telegramUser: null,
        token: null,
        isLoading: false,
        isInitializing: true,
        error: null,

        // Initialize Telegram WebApp
        initializeTelegramWebApp: () => {
          set({ isInitializing: true });
          
          try {
            // Check if we're in Telegram WebApp environment
            if (window.Telegram?.WebApp) {
              const tg = window.Telegram.WebApp;
              
              // Initialize Telegram WebApp
              tg.ready();
              
              // Get Telegram user data
              const telegramUser = tg.initDataUnsafe?.user;
              
              if (telegramUser) {
                set({ 
                  telegramUser,
                  isInitializing: false 
                });
                
                // Auto-login if we have Telegram user data
                get().login(tg.initDataUnsafe);
              } else {
                set({ 
                  isInitializing: false,
                  error: 'No Telegram user data available'
                });
              }
            } else {
              // Not in Telegram environment - for development
              console.warn('Not running in Telegram WebApp environment');
              set({ 
                isInitializing: false,
                // Mock Telegram user for development
                telegramUser: {
                  id: 123456789,
                  first_name: 'Test',
                  last_name: 'User',
                  username: 'testuser',
                  language_code: 'en'
                }
              });
              
              // Auto-login with mock data for development
              get().login({
                user: {
                  id: 123456789,
                  first_name: 'Test',
                  last_name: 'User',
                  username: 'testuser',
                }
              });
            }
          } catch (error) {
            console.error('Failed to initialize Telegram WebApp:', error);
            set({ 
              isInitializing: false,
              error: 'Failed to initialize Telegram WebApp'
            });
          }
        },

        // Login function
        login: async (telegramData: any) => {
          set({ isLoading: true, error: null });
          
          try {
            // Authenticate with backend using Telegram data
            const { user, token } = await mockAuthenticate(telegramData);
            
            set({
              isAuthenticated: true,
              user,
              token,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            console.error('Authentication failed:', error);
            set({
              isAuthenticated: false,
              user: null,
              token: null,
              isLoading: false,
              error: error instanceof Error ? error.message : 'Authentication failed',
            });
          }
        },

        // Logout function
        logout: () => {
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            error: null,
          });
          
          // Clear any persisted data
          localStorage.removeItem('electoral-auth-storage');
        },

        // Update user information
        updateUser: (userData: Partial<ElectoralUser>) => {
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, ...userData }
            });
          }
        },

        // Clear error
        clearError: () => {
          set({ error: null });
        },

        // Set loading state
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },
      }),
      {
        name: 'electoral-auth-storage',
        // Only persist essential authentication data
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          token: state.token,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

// Selectors for easy access to auth state
export const useAuthSelectors = () => {
  const store = useAuthStore();
  
  return {
    // Basic auth state
    isAuthenticated: store.isAuthenticated,
    user: store.user,
    telegramUser: store.telegramUser,
    isLoading: store.isLoading,
    error: store.error,
    
    // Computed values
    userRole: store.user?.role,
    userConstituency: store.user?.constituency,
    userPermissions: store.user?.permissions || [],
    assignedBooths: store.user?.assignedBooths || [],
    
    // Permission checkers
    hasPermission: (resource: string, action: string) => {
      const permissions = store.user?.permissions || [];
      return permissions.some(p => p.resource === resource && p.action === action);
    },
    
    canAccessBooth: (boothNumber: number) => {
      const assignedBooths = store.user?.assignedBooths || [];
      const role = store.user?.role;
      
      // Constituency managers can access all booths
      if (role === 'constituency_manager') return true;
      
      // Others can only access assigned booths
      return assignedBooths.includes(boothNumber);
    },
    
    // Role checkers
    isConstituencyManager: store.user?.role === 'constituency_manager',
    isBoothOfficer: store.user?.role === 'booth_officer',
    isSupervisor: store.user?.role === 'supervisor',
    isDataEntry: store.user?.role === 'data_entry',
  };
};

// Hook for auth actions
export const useAuthActions = () => {
  const store = useAuthStore();
  
  return {
    login: store.login,
    logout: store.logout,
    initializeTelegramWebApp: store.initializeTelegramWebApp,
    updateUser: store.updateUser,
    clearError: store.clearError,
    setLoading: store.setLoading,
  };
};

// Initialize auth store on app startup
export const initializeAuth = () => {
  const { initializeTelegramWebApp } = useAuthStore.getState();
  initializeTelegramWebApp();
};