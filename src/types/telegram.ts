// Telegram WebApp API Type Definitions
// Based on official Telegram WebApp API documentation

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export interface TelegramWebApp {
  // WebApp instance properties
  initData: string;
  initDataUnsafe: TelegramInitDataUnsafe;
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: TelegramThemeParams;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;

  // WebApp methods
  ready(): void;
  expand(): void;
  close(): void;
  
  // Main Button
  MainButton: TelegramMainButton;
  
  // Back Button
  BackButton: TelegramBackButton;
  
  // Settings Button
  SettingsButton: TelegramSettingsButton;
  
  // Haptic Feedback
  HapticFeedback: TelegramHapticFeedback;
  
  // Cloud Storage
  CloudStorage: TelegramCloudStorage;
  
  // Methods
  sendData(data: string): void;
  switchInlineQuery(query: string, choose_chat_types?: string[]): void;
  openLink(url: string, options?: { try_instant_view?: boolean }): void;
  openTelegramLink(url: string): void;
  openInvoice(url: string, callback?: (status: string) => void): void;
  showPopup(params: TelegramPopupParams, callback?: (button_id?: string) => void): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
  showScanQrPopup(params: TelegramScanQrParams, callback?: (text: string) => boolean): void;
  closeScanQrPopup(): void;
  readTextFromClipboard(callback?: (text: string) => void): void;
  requestWriteAccess(callback?: (granted: boolean) => void): void;
  requestContact(callback?: (granted: boolean, contact?: TelegramContact) => void): void;
  
  // Event handling
  onEvent(eventType: TelegramWebAppEvent, callback: () => void): void;
  offEvent(eventType: TelegramWebAppEvent, callback: () => void): void;
}

export interface TelegramInitDataUnsafe {
  query_id?: string;
  user?: TelegramUser;
  receiver?: TelegramUser;
  chat?: TelegramChat;
  chat_type?: string;
  chat_instance?: string;
  start_param?: string;
  can_send_after?: number;
  auth_date: number;
  hash: string;
}

export interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

export interface TelegramChat {
  id: number;
  type: 'group' | 'supergroup' | 'channel';
  title: string;
  username?: string;
  photo_url?: string;
}

export interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
}

export interface TelegramMainButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  readonly isProgressVisible: boolean;
  
  setText(text: string): TelegramMainButton;
  onClick(callback: () => void): TelegramMainButton;
  offClick(callback: () => void): TelegramMainButton;
  show(): TelegramMainButton;
  hide(): TelegramMainButton;
  enable(): TelegramMainButton;
  disable(): TelegramMainButton;
  showProgress(leaveActive?: boolean): TelegramMainButton;
  hideProgress(): TelegramMainButton;
  setParams(params: {
    text?: string;
    color?: string;
    text_color?: string;
    is_active?: boolean;
    is_visible?: boolean;
  }): TelegramMainButton;
}

export interface TelegramBackButton {
  isVisible: boolean;
  
  onClick(callback: () => void): TelegramBackButton;
  offClick(callback: () => void): TelegramBackButton;
  show(): TelegramBackButton;
  hide(): TelegramBackButton;
}

export interface TelegramSettingsButton {
  isVisible: boolean;
  
  onClick(callback: () => void): TelegramSettingsButton;
  offClick(callback: () => void): TelegramSettingsButton;
  show(): TelegramSettingsButton;
  hide(): TelegramSettingsButton;
}

export interface TelegramHapticFeedback {
  impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
  notificationOccurred(type: 'error' | 'success' | 'warning'): void;
  selectionChanged(): void;
}

export interface TelegramCloudStorage {
  setItem(key: string, value: string, callback?: (error?: string, result?: boolean) => void): void;
  getItem(key: string, callback: (error?: string, result?: string) => void): void;
  getItems(keys: string[], callback: (error?: string, result?: { [key: string]: string }) => void): void;
  removeItem(key: string, callback?: (error?: string, result?: boolean) => void): void;
  removeItems(keys: string[], callback?: (error?: string, result?: boolean) => void): void;
  getKeys(callback: (error?: string, result?: string[]) => void): void;
}

export interface TelegramPopupParams {
  title?: string;
  message: string;
  buttons?: TelegramPopupButton[];
}

export interface TelegramPopupButton {
  id?: string;
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
  text?: string;
}

export interface TelegramScanQrParams {
  text?: string;
}

export interface TelegramContact {
  contact: {
    user_id: number;
    phone_number: string;
    first_name: string;
    last_name?: string;
    vcard?: string;
  };
}

export type TelegramWebAppEvent = 
  | 'themeChanged'
  | 'viewportChanged'
  | 'mainButtonClicked'
  | 'backButtonClicked'
  | 'settingsButtonClicked'
  | 'invoiceClosed'
  | 'popupClosed'
  | 'qrTextReceived'
  | 'scanQrPopupClosed'
  | 'clipboardTextReceived'
  | 'writeAccessRequested'
  | 'contactRequested';

// Utility type for WebApp initialization
export interface WebAppInitParams {
  tgWebAppData?: string;
  tgWebAppVersion?: string;
  tgWebAppPlatform?: string;
  tgWebAppThemeParams?: TelegramThemeParams;
}

// Export types for use in components
export type {
  TelegramWebApp as TelegramWebAppType,
  TelegramUser as TelegramUserType,
  TelegramMainButton as TelegramMainButtonType,
};

export {};