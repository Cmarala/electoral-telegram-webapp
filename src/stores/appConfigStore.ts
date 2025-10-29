import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { LanguageConfig } from '../types';

// App configuration store interface
interface AppConfigState {
  // Language settings
  currentLanguage: 'en' | 'te' | 'hi';
  availableLanguages: LanguageConfig[];
  rtlMode: boolean;
  
  // Theme settings
  theme: 'light' | 'dark' | 'auto';
  colorScheme: 'default' | 'electoral' | 'party_branded';
  
  // UI preferences
  compactMode: boolean;
  showTutorial: boolean;
  enableAnimations: boolean;
  
  // Offline settings
  isOffline: boolean;
  lastSyncTimestamp: Date | null;
  autoSyncEnabled: boolean;
  syncInterval: number; // in minutes
  
  // Performance settings
  paginationSize: number;
  maxSearchResults: number;
  enableVirtualScrolling: boolean;
  
  // Notification settings
  enableNotifications: boolean;
  notificationSound: boolean;
  
  // Security settings
  sessionTimeout: number; // in minutes
  autoLockEnabled: boolean;
  
  // Debug settings
  debugMode: boolean;
  verboseLogging: boolean;
  
  // Actions
  setLanguage: (language: 'en' | 'te' | 'hi') => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setColorScheme: (scheme: 'default' | 'electoral' | 'party_branded') => void;
  updateUIPreferences: (preferences: Partial<{
    compactMode: boolean;
    showTutorial: boolean;
    enableAnimations: boolean;
  }>) => void;
  updateOfflineSettings: (settings: Partial<{
    autoSyncEnabled: boolean;
    syncInterval: number;
  }>) => void;
  updatePerformanceSettings: (settings: Partial<{
    paginationSize: number;
    maxSearchResults: number;
    enableVirtualScrolling: boolean;
  }>) => void;
  updateNotificationSettings: (settings: Partial<{
    enableNotifications: boolean;
    notificationSound: boolean;
  }>) => void;
  updateSecuritySettings: (settings: Partial<{
    sessionTimeout: number;
    autoLockEnabled: boolean;
  }>) => void;
  setOfflineStatus: (isOffline: boolean) => void;
  updateLastSync: (timestamp: Date) => void;
  toggleDebugMode: () => void;
  resetToDefaults: () => void;
}

// Default configuration
const defaultConfig = {
  currentLanguage: 'en' as const,
  availableLanguages: [
    {
      code: 'en' as const,
      name: 'English',
      nameLocal: 'English',
      isDefault: true,
      direction: 'ltr' as const,
      enabled: true,
    },
    {
      code: 'te' as const,
      name: 'Telugu',
      nameLocal: 'తెలుగు',
      isDefault: false,
      direction: 'ltr' as const,
      enabled: true,
    },
    {
      code: 'hi' as const,
      name: 'Hindi',
      nameLocal: 'हिंदी',
      isDefault: false,
      direction: 'ltr' as const,
      enabled: true,
    },
  ] as LanguageConfig[],
  rtlMode: false,
  
  theme: 'light' as const,
  colorScheme: 'electoral' as const,
  
  compactMode: false,
  showTutorial: true,
  enableAnimations: true,
  
  isOffline: false,
  lastSyncTimestamp: null,
  autoSyncEnabled: true,
  syncInterval: 5, // 5 minutes
  
  paginationSize: 50,
  maxSearchResults: 1000,
  enableVirtualScrolling: true,
  
  enableNotifications: true,
  notificationSound: true,
  
  sessionTimeout: 30, // 30 minutes
  autoLockEnabled: false,
  
  debugMode: false,
  verboseLogging: false,
};

// Create app config store with persistence
export const useAppConfigStore = create<AppConfigState>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultConfig,

        // Language actions
        setLanguage: (language: 'en' | 'te' | 'hi') => {
          const availableLanguages = get().availableLanguages;
          const selectedLanguage = availableLanguages.find(lang => lang.code === language);
          
          set({
            currentLanguage: language,
            rtlMode: selectedLanguage?.direction === 'rtl',
          });
          
          // Update document language and direction
          document.documentElement.lang = language;
          document.documentElement.dir = selectedLanguage?.direction || 'ltr';
          
          // Store language preference in localStorage for immediate access
          localStorage.setItem('electoral-app-language', language);
        },

        // Theme actions
        setTheme: (theme: 'light' | 'dark' | 'auto') => {
          set({ theme });
          
          // Apply theme immediately
          if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
          } else {
            document.documentElement.setAttribute('data-theme', theme);
          }
        },

        setColorScheme: (scheme: 'default' | 'electoral' | 'party_branded') => {
          set({ colorScheme: scheme });
          document.documentElement.setAttribute('data-color-scheme', scheme);
        },

        // UI preference actions
        updateUIPreferences: (preferences) => {
          set(state => ({
            ...state,
            ...preferences,
          }));
        },

        // Offline settings actions
        updateOfflineSettings: (settings) => {
          set(state => ({
            ...state,
            ...settings,
          }));
        },

        // Performance settings actions
        updatePerformanceSettings: (settings) => {
          set(state => ({
            ...state,
            ...settings,
          }));
        },

        // Notification settings actions
        updateNotificationSettings: (settings) => {
          set(state => ({
            ...state,
            ...settings,
          }));
        },

        // Security settings actions
        updateSecuritySettings: (settings) => {
          set(state => ({
            ...state,
            ...settings,
          }));
        },

        // Offline status actions
        setOfflineStatus: (isOffline: boolean) => {
          set({ isOffline });
          
          // Dispatch custom event for offline status change
          window.dispatchEvent(new CustomEvent('app-offline-status-change', {
            detail: { isOffline }
          }));
        },

        updateLastSync: (timestamp: Date) => {
          set({ lastSyncTimestamp: timestamp });
        },

        // Debug actions
        toggleDebugMode: () => {
          set(state => {
            const newDebugMode = !state.debugMode;
            
            // Enable/disable console logging based on debug mode
            if (newDebugMode) {
              console.log('🐛 Debug mode enabled');
              window.addEventListener('error', console.error);
              window.addEventListener('unhandledrejection', console.error);
            } else {
              console.log('🐛 Debug mode disabled');
            }
            
            return { debugMode: newDebugMode };
          });
        },

        // Reset to defaults
        resetToDefaults: () => {
          set(defaultConfig);
          
          // Reset DOM attributes
          document.documentElement.lang = 'en';
          document.documentElement.dir = 'ltr';
          document.documentElement.setAttribute('data-theme', 'light');
          document.documentElement.setAttribute('data-color-scheme', 'electoral');
          
          // Clear localStorage preferences
          localStorage.removeItem('electoral-app-language');
        },
      }),
      {
        name: 'electoral-app-config',
        // Persist all configuration except temporary states
        partialize: (state) => ({
          currentLanguage: state.currentLanguage,
          availableLanguages: state.availableLanguages,
          theme: state.theme,
          colorScheme: state.colorScheme,
          compactMode: state.compactMode,
          showTutorial: state.showTutorial,
          enableAnimations: state.enableAnimations,
          autoSyncEnabled: state.autoSyncEnabled,
          syncInterval: state.syncInterval,
          paginationSize: state.paginationSize,
          maxSearchResults: state.maxSearchResults,
          enableVirtualScrolling: state.enableVirtualScrolling,
          enableNotifications: state.enableNotifications,
          notificationSound: state.notificationSound,
          sessionTimeout: state.sessionTimeout,
          autoLockEnabled: state.autoLockEnabled,
          debugMode: state.debugMode,
          verboseLogging: state.verboseLogging,
        }),
      }
    ),
    {
      name: 'app-config-store',
    }
  )
);

// Selectors for app config
export const useAppConfigSelectors = () => {
  const store = useAppConfigStore();
  
  return {
    // Language settings
    currentLanguage: store.currentLanguage,
    availableLanguages: store.availableLanguages,
    rtlMode: store.rtlMode,
    currentLanguageConfig: store.availableLanguages.find(
      lang => lang.code === store.currentLanguage
    ),
    
    // Theme settings
    theme: store.theme,
    colorScheme: store.colorScheme,
    isDarkTheme: store.theme === 'dark' || 
                 (store.theme === 'auto' && 
                  window.matchMedia('(prefers-color-scheme: dark)').matches),
    
    // UI preferences
    compactMode: store.compactMode,
    showTutorial: store.showTutorial,
    enableAnimations: store.enableAnimations,
    
    // Offline settings
    isOffline: store.isOffline,
    lastSyncTimestamp: store.lastSyncTimestamp,
    autoSyncEnabled: store.autoSyncEnabled,
    syncInterval: store.syncInterval,
    
    // Performance settings
    paginationSize: store.paginationSize,
    maxSearchResults: store.maxSearchResults,
    enableVirtualScrolling: store.enableVirtualScrolling,
    
    // Notification settings
    enableNotifications: store.enableNotifications,
    notificationSound: store.notificationSound,
    
    // Security settings
    sessionTimeout: store.sessionTimeout,
    autoLockEnabled: store.autoLockEnabled,
    
    // Debug settings
    debugMode: store.debugMode,
    verboseLogging: store.verboseLogging,
  };
};

// Hook for app config actions
export const useAppConfigActions = () => {
  const store = useAppConfigStore();
  
  return {
    setLanguage: store.setLanguage,
    setTheme: store.setTheme,
    setColorScheme: store.setColorScheme,
    updateUIPreferences: store.updateUIPreferences,
    updateOfflineSettings: store.updateOfflineSettings,
    updatePerformanceSettings: store.updatePerformanceSettings,
    updateNotificationSettings: store.updateNotificationSettings,
    updateSecuritySettings: store.updateSecuritySettings,
    setOfflineStatus: store.setOfflineStatus,
    updateLastSync: store.updateLastSync,
    toggleDebugMode: store.toggleDebugMode,
    resetToDefaults: store.resetToDefaults,
  };
};

// Initialize app config on startup
export const initializeAppConfig = () => {
  const { currentLanguage, theme, colorScheme } = useAppConfigStore.getState();
  
  // Set initial language and direction
  document.documentElement.lang = currentLanguage;
  const languageConfig = useAppConfigStore.getState().availableLanguages.find(
    lang => lang.code === currentLanguage
  );
  document.documentElement.dir = languageConfig?.direction || 'ltr';
  
  // Set initial theme
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  // Set initial color scheme
  document.documentElement.setAttribute('data-color-scheme', colorScheme);
  
  // Listen for system theme changes
  if (theme === 'auto') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });
  }
  
  // Listen for online/offline events
  window.addEventListener('online', () => {
    useAppConfigStore.getState().setOfflineStatus(false);
  });
  
  window.addEventListener('offline', () => {
    useAppConfigStore.getState().setOfflineStatus(true);
  });
  
  // Set initial offline status
  useAppConfigStore.getState().setOfflineStatus(!navigator.onLine);
};