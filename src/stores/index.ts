// Store exports and initialization
// Centralized store management for the Electoral Management TWA

// Store exports
export { useAuthStore, useAuthSelectors, useAuthActions, initializeAuth } from './authStore';
export { useVoterStore, useVoterSelectors, useVoterActions } from './voterStore';
export { 
  useAppConfigStore, 
  useAppConfigSelectors, 
  useAppConfigActions, 
  initializeAppConfig 
} from './appConfigStore';

// Import for internal use
import { useAuthStore, initializeAuth } from './authStore';
import { useVoterStore } from './voterStore';
import { useAppConfigStore, initializeAppConfig } from './appConfigStore';

// Combined initialization function for all stores
export const initializeStores = () => {
  // Initialize app configuration first
  initializeAppConfig();
  
  // Initialize authentication
  initializeAuth();
  
  console.log('📱 Electoral Management TWA stores initialized');
};

// Hook to get all store states in development/debugging
export const useDevStoreSnapshot = () => {
  const authStore = useAuthStore();
  const voterStore = useVoterStore();
  const configStore = useAppConfigStore();
  
  return {
    auth: {
      isAuthenticated: authStore.isAuthenticated,
      user: authStore.user,
      isLoading: authStore.isLoading,
    },
    voters: {
      searchResults: voterStore.searchResults,
      selectedVoter: voterStore.selectedVoter,
      isSearching: voterStore.isSearching,
    },
    config: {
      currentLanguage: configStore.currentLanguage,
      theme: configStore.theme,
      isOffline: configStore.isOffline,
    },
  };
};

// Store reset function for logout/cleanup
export const resetAllStores = () => {
  // Reset auth store
  useAuthStore.getState().logout();
  
  // Clear voter store search results
  useVoterStore.getState().clearSearchResults();
  
  // Reset app config to defaults if needed
  // useAppConfigStore.getState().resetToDefaults();
  
  console.log('🧹 All stores reset');
};

// Error boundary integration
export const handleStoreError = (error: Error, errorInfo: any) => {
  console.error('Store Error:', error, errorInfo);
  
  // You can add error reporting here
  // reportError(error, errorInfo);
  
  // Optionally reset stores on critical errors
  if (error.message.includes('critical')) {
    resetAllStores();
  }
};