// Core types for the Electoral Management Telegram Web App
// Based on Android app analysis and MVP requirements

export interface ElectoralUser {
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  role: 'booth_officer' | 'supervisor' | 'constituency_manager' | 'data_entry';
  constituency: string;
  permissions: Permission[];
  assignedBooths?: number[];
  isActive: boolean;
  lastLogin?: Date;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface Constituency {
  id: string;
  name: string;
  state: string;
  district: string;
  assemblyNumber?: number;
  totalBooths: number;
  totalVoters: number;
  config: ConstituencyConfig;
  isActive: boolean;
}

export interface ConstituencyConfig {
  language: 'en' | 'te' | 'hi';
  theme: 'default' | 'party_branded';
  features: string[];
}

export interface Voter {
  // Core identification
  id: string;
  voterIdNumber: string;       // Epic ID
  boothNumber: number;
  serialNumber: number;        // Serial in booth
  
  // Personal information (multilingual)
  nameEnglish: string;
  nameTelugu?: string;
  fatherNameEnglish: string;
  fatherNameTelugu?: string;
  
  // Demographics
  age: number;
  gender: 'M' | 'F' | 'T';
  dateOfBirth?: Date;
  
  // Contact information (up to 4 mobile numbers like Android app)
  mobilePrimary?: string;
  mobileSecondary?: string;
  mobileTertiary?: string;
  mobileQuaternary?: string;
  
  // Address
  houseNumber: string;
  street?: string;
  locality: string;
  pincode: string;
  
  // Classification
  caste?: string;
  religion?: string;
  education?: string;
  occupation?: string;
  
  // Electoral data
  partyAffiliation?: string;
  lastVotedElection?: string;
  votingStatus: 'eligible' | 'shifted' | 'deceased' | 'duplicate';
  
  // Survey responses
  surveyResponses?: SurveyResponse[];
  
  // Metadata
  photoUrl?: string;
  lastUpdated: Date;
  updatedBy: string;
  syncStatus: 'synced' | 'pending' | 'conflict';
}

export interface VoterSearchFilters {
  // Text-based searches
  name?: string;                 // Fuzzy matching in Telugu/English
  fatherName?: string;          // Father's name search
  voterIdNumber?: string;       // Epic ID lookup
  mobileNumber?: string;        // Phone number search
  houseNumber?: string;         // Address-based search
  
  // Booth-based filters
  boothNumber?: number;         // Booth-wise filtering
  serialNumberRange?: [number, number]; // Booth serial numbers
  
  // Demographic filters
  ageRange?: [number, number];  // Age-based filtering
  gender?: 'M' | 'F' | 'T';     // Gender filter
  caste?: string;               // Caste-wise filtering
  
  // Location filters
  locality?: string;            // Area-wise filtering
  pincode?: string;            // PIN code search
  
  // Electoral filters
  partyAffiliation?: string;    // Political preference
  surveyStatus?: 'completed' | 'pending'; // Survey completion
  
  // Metadata
  limit: number;               // Pagination limit
  offset: number;              // Pagination offset
}

export interface Booth {
  id: string;
  constituencyId: string;
  boothNumber: number;
  boothName: string;
  boothNameTelugu?: string;
  
  // Location information
  schoolName: string;
  roomNumber?: string;
  address: string;
  locality: string;
  pincode: string;
  
  // Statistics
  totalVoters: number;
  maleVoters: number;
  femaleVoters: number;
  transgenderVoters: number;
  
  // Staff assignment
  assignedOfficers: string[];          // Telegram user IDs
  
  // Status
  isActive: boolean;
  lastSurveyDate?: Date;
  surveyCompletionRate: number;        // Percentage of voters surveyed
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyTemplate {
  id: string;
  name: string;
  nameLocal: string;
  type: 'door_to_door' | 'phone_survey' | 'event_survey' | 'verification';
  questions: SurveyQuestion[];
  isActive: boolean;
  targetAudience: 'all_voters' | 'booth_specific' | 'age_group' | 'demographic';
}

export interface SurveyQuestion {
  id: string;
  type: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'yes_no' | 'rating';
  questionEnglish: string;
  questionTelugu: string;
  options?: SurveyOption[];
  required: boolean;
  conditionalLogic?: ConditionalRule[];
}

export interface SurveyOption {
  id: string;
  labelEnglish: string;
  labelTelugu: string;
  value: string;
}

export interface ConditionalRule {
  condition: string;
  showQuestions: string[];
  hideQuestions: string[];
}

export interface SurveyResponse {
  id: string;
  voterId: string;
  surveyTemplateId: string;
  surveyorId: string;                    // Telegram user ID
  responses: Record<string, any>;        // Question ID -> Response
  notes?: string;
  
  // Metadata
  conductedAt: Date;
  location?: GeolocationCoordinates;     // GPS coordinates
  method: 'in_person' | 'phone' | 'digital';
  duration?: number;                     // Survey duration in minutes
  
  // Sync status
  syncStatus: 'pending' | 'synced' | 'failed';
  syncedAt?: Date;
  conflicts?: SurveyConflict[];
}

export interface SurveyConflict {
  questionId: string;
  localResponse: any;
  serverResponse: any;
  resolvedWith?: 'local' | 'server' | 'manual';
}

export interface SearchResults<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Telegram WebApp types
export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    auth_date: number;
    hash: string;
  };
  ready(): void;
  close(): void;
  expand(): void;
  MainButton: TelegramMainButton;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface TelegramMainButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  show(): void;
  hide(): void;
  onClick(callback: () => void): void;
}

// Language and i18n types
export interface LanguageConfig {
  code: 'te' | 'en' | 'hi';           // Telugu, English, Hindi
  name: string;
  nameLocal: string;
  isDefault: boolean;
  direction: 'ltr' | 'rtl';
  enabled: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Offline sync types
export interface SyncOperation {
  id: string;
  operation: 'create' | 'update' | 'delete';
  tableName: string;
  recordId: string;
  data: any;
  timestamp: Date;
  retryCount: number;
  status: 'pending' | 'synced' | 'failed';
}

export interface LastSync {
  tableName: string;
  timestamp: Date;
}

// Statistics and analytics types
export interface BoothStatistics {
  boothNumber: number;
  totalVoters: number;
  surveysCompleted: number;
  surveysPending: number;
  mobileNumbersCollected: number;
  averageAge: number;
  genderDistribution: Record<string, number>;
  casteDistribution: Record<string, number>;
  partyPreference?: Record<string, number>;
}

export interface ConstituencyStatistics {
  totalVoters: number;
  totalBooths: number;
  surveysCompleted: number;
  surveyCompletionRate: number;
  mobileNumberCoverage: number;
  lastSyncTimestamp: Date;
  boothStatistics: BoothStatistics[];
}