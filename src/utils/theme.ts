import { theme } from 'antd';
import type { ThemeConfig } from 'antd';

// Electoral Management Theme Configuration
// Simplified version for production deployment
export const electoralTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // Color scheme - Professional government application colors
    colorPrimary: '#1890ff', // Primary blue for electoral operations
    colorSuccess: '#52c41a', // Success green for completed operations
    colorWarning: '#faad14', // Warning amber for pending items
    colorError: '#ff4d4f',   // Error red for issues
    colorInfo: '#1890ff',    // Info blue
    
    // Layout colors
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBgElevated: '#ffffff',
    
    // Text colors
    colorText: '#262626',
    colorTextSecondary: '#8c8c8c',
    
    // Border colors
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    
    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    
    // Layout spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // Border radius for modern look
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
  },
  components: {
    // Layout components
    Layout: {
      headerBg: '#001529', // Dark header for professional look
      headerHeight: 64,
      siderBg: '#001529',
      bodyBg: '#f5f5f5',
    },
    
    // Button styling for electoral actions
    Button: {
      borderRadius: 6,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      fontSize: 14,
    },
    
    // Table styling for voter lists (critical component)
    Table: {
      headerBg: '#fafafa',
      headerColor: '#262626',
      rowHoverBg: '#f5f5f5',
      borderColor: '#f0f0f0',
      fontSize: 14,
    },
    
    // Card components for voter profiles and statistics
    Card: {
      borderRadiusLG: 8,
      paddingLG: 24,
      fontSize: 14,
      headerBg: 'transparent',
    },
    
    // Input components
    Input: {
      borderRadius: 6,
      controlHeight: 36,
      controlHeightLG: 44,
      fontSize: 14,
    },
  },
};

// Dark theme configuration for night operations
export const electoralDarkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    ...electoralTheme.token,
    colorBgContainer: '#141414',
    colorBgLayout: '#000000',
    colorBgElevated: '#1f1f1f',
    colorText: '#ffffff',
    colorTextSecondary: '#a6a6a6',
    colorBorder: '#424242',
  },
  components: {
    ...electoralTheme.components,
    Layout: {
      headerBg: '#141414',
      siderBg: '#001529',
      bodyBg: '#000000',
    },
  },
};

// Responsive theme hook
export const useElectoralTheme = () => {
  // Return the standard theme for now
  return electoralTheme;
};