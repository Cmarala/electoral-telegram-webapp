import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  Voter, 
  VoterSearchFilters, 
  SearchResults,
  Booth,
  ConstituencyStatistics 
} from '../types';

// Voter store interface
interface VoterState {
  // Search state
  searchFilters: VoterSearchFilters;
  searchResults: SearchResults<Voter>;
  searchHistory: VoterSearchFilters[];
  isSearching: boolean;
  
  // Selected voter state
  selectedVoter: Voter | null;
  isLoadingVoter: boolean;
  
  // Voter editing state
  editingVoter: Voter | null;
  isDirty: boolean;
  isSaving: boolean;
  
  // Booth data
  booths: Booth[];
  selectedBooth: Booth | null;
  
  // Statistics
  statistics: ConstituencyStatistics | null;
  
  // Error handling
  error: string | null;
  
  // Actions
  setSearchFilters: (filters: Partial<VoterSearchFilters>) => void;
  searchVoters: (filters?: Partial<VoterSearchFilters>) => Promise<void>;
  clearSearchResults: () => void;
  addToSearchHistory: (filters: VoterSearchFilters) => void;
  
  selectVoter: (voter: Voter | null) => void;
  loadVoter: (voterId: string) => Promise<void>;
  
  startEditingVoter: (voter: Voter) => void;
  updateEditingVoter: (updates: Partial<Voter>) => void;
  saveVoter: () => Promise<void>;
  cancelEditing: () => void;
  
  loadBooths: () => Promise<void>;
  selectBooth: (booth: Booth | null) => void;
  
  loadStatistics: () => Promise<void>;
  
  clearError: () => void;
}

// Mock data and functions (will be replaced with actual API calls)
const mockVoters: Voter[] = [
  {
    id: '1',
    voterIdNumber: 'ABC1234567',
    boothNumber: 1,
    serialNumber: 101,
    nameEnglish: 'Rajesh Kumar',
    nameTelugu: 'రాజేష్ కుమార్',
    fatherNameEnglish: 'Suresh Kumar',
    fatherNameTelugu: 'సురేష్ కుమార్',
    age: 35,
    gender: 'M',
    mobilePrimary: '+91-9876543210',
    houseNumber: '12-34',
    locality: 'Gandhi Nagar',
    pincode: '500001',
    caste: 'General',
    votingStatus: 'eligible',
    lastUpdated: new Date(),
    updatedBy: 'system',
    syncStatus: 'synced',
  },
  {
    id: '2',
    voterIdNumber: 'XYZ9876543',
    boothNumber: 1,
    serialNumber: 102,
    nameEnglish: 'Lakshmi Devi',
    nameTelugu: 'లక్ష్మీ దేవి',
    fatherNameEnglish: 'Ram Prasad',
    fatherNameTelugu: 'రామ్ ప్రసాద్',
    age: 28,
    gender: 'F',
    mobilePrimary: '+91-8765432109',
    houseNumber: '15-67',
    locality: 'Gandhi Nagar',
    pincode: '500001',
    caste: 'BC-A',
    votingStatus: 'eligible',
    lastUpdated: new Date(),
    updatedBy: 'system',
    syncStatus: 'synced',
  },
];

const mockBooths: Booth[] = [
  {
    id: '1',
    constituencyId: 'CONSTITUENCY_001',
    boothNumber: 1,
    boothName: 'Government High School',
    boothNameTelugu: 'ప్రభుత్వ ఉన్నత పాఠశాల',
    schoolName: 'Government High School',
    address: 'Gandhi Nagar, Hyderabad',
    locality: 'Gandhi Nagar',
    pincode: '500001',
    totalVoters: 1200,
    maleVoters: 650,
    femaleVoters: 540,
    transgenderVoters: 10,
    assignedOfficers: ['123456789'],
    isActive: true,
    surveyCompletionRate: 85.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock API functions
const mockSearchVoters = async (filters: VoterSearchFilters): Promise<SearchResults<Voter>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredVoters = [...mockVoters];
  
  // Apply filters
  if (filters.name) {
    const searchTerm = filters.name.toLowerCase();
    filteredVoters = filteredVoters.filter(voter => 
      voter.nameEnglish.toLowerCase().includes(searchTerm) ||
      voter.nameTelugu?.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.boothNumber) {
    filteredVoters = filteredVoters.filter(voter => 
      voter.boothNumber === filters.boothNumber
    );
  }
  
  if (filters.mobileNumber) {
    filteredVoters = filteredVoters.filter(voter => 
      voter.mobilePrimary?.includes(filters.mobileNumber!) ||
      voter.mobileSecondary?.includes(filters.mobileNumber!) ||
      voter.mobileTertiary?.includes(filters.mobileNumber!) ||
      voter.mobileQuaternary?.includes(filters.mobileNumber!)
    );
  }
  
  // Pagination
  const start = filters.offset || 0;
  const end = start + (filters.limit || 50);
  const paginatedResults = filteredVoters.slice(start, end);
  
  return {
    data: paginatedResults,
    total: filteredVoters.length,
    page: Math.floor(start / (filters.limit || 50)) + 1,
    limit: filters.limit || 50,
    hasMore: end < filteredVoters.length,
  };
};

const mockLoadVoter = async (voterId: string): Promise<Voter> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const voter = mockVoters.find(v => v.id === voterId);
  if (!voter) throw new Error('Voter not found');
  return voter;
};

const mockSaveVoter = async (voter: Voter): Promise<Voter> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  // Simulate save operation
  return { ...voter, lastUpdated: new Date(), syncStatus: 'synced' };
};

// Create voter store
export const useVoterStore = create<VoterState>()(
  devtools(
    (set, get) => ({
      // Initial state
      searchFilters: {
        limit: 50,
        offset: 0,
      },
      searchResults: {
        data: [],
        total: 0,
        page: 1,
        limit: 50,
        hasMore: false,
      },
      searchHistory: [],
      isSearching: false,
      
      selectedVoter: null,
      isLoadingVoter: false,
      
      editingVoter: null,
      isDirty: false,
      isSaving: false,
      
      booths: [],
      selectedBooth: null,
      
      statistics: null,
      error: null,

      // Search actions
      setSearchFilters: (filters: Partial<VoterSearchFilters>) => {
        set(state => ({
          searchFilters: { ...state.searchFilters, ...filters }
        }));
      },

      searchVoters: async (filters?: Partial<VoterSearchFilters>) => {
        const currentFilters = get().searchFilters;
        const searchFilters = filters ? { ...currentFilters, ...filters } : currentFilters;
        
        set({ isSearching: true, error: null });
        
        try {
          const results = await mockSearchVoters(searchFilters);
          
          set({
            searchResults: results,
            searchFilters,
            isSearching: false,
          });
          
          // Add to search history if it's a new search (not pagination)
          if (!filters?.offset) {
            get().addToSearchHistory(searchFilters);
          }
        } catch (error) {
          console.error('Search failed:', error);
          set({
            isSearching: false,
            error: error instanceof Error ? error.message : 'Search failed',
          });
        }
      },

      clearSearchResults: () => {
        set({
          searchResults: {
            data: [],
            total: 0,
            page: 1,
            limit: 50,
            hasMore: false,
          },
          searchFilters: {
            limit: 50,
            offset: 0,
          },
        });
      },

      addToSearchHistory: (filters: VoterSearchFilters) => {
        set(state => {
          const history = state.searchHistory.filter(h => 
            JSON.stringify(h) !== JSON.stringify(filters)
          );
          return {
            searchHistory: [filters, ...history].slice(0, 10) // Keep last 10 searches
          };
        });
      },

      // Voter selection actions
      selectVoter: (voter: Voter | null) => {
        set({ selectedVoter: voter });
      },

      loadVoter: async (voterId: string) => {
        set({ isLoadingVoter: true, error: null });
        
        try {
          const voter = await mockLoadVoter(voterId);
          set({
            selectedVoter: voter,
            isLoadingVoter: false,
          });
        } catch (error) {
          console.error('Failed to load voter:', error);
          set({
            isLoadingVoter: false,
            error: error instanceof Error ? error.message : 'Failed to load voter',
          });
        }
      },

      // Voter editing actions
      startEditingVoter: (voter: Voter) => {
        set({
          editingVoter: { ...voter }, // Create a copy
          isDirty: false,
        });
      },

      updateEditingVoter: (updates: Partial<Voter>) => {
        const editingVoter = get().editingVoter;
        if (editingVoter) {
          set({
            editingVoter: { ...editingVoter, ...updates },
            isDirty: true,
          });
        }
      },

      saveVoter: async () => {
        const editingVoter = get().editingVoter;
        if (!editingVoter) return;

        set({ isSaving: true, error: null });

        try {
          const savedVoter = await mockSaveVoter(editingVoter);
          
          set({
            selectedVoter: savedVoter,
            editingVoter: null,
            isDirty: false,
            isSaving: false,
          });
          
          // Update search results if the saved voter is in current results
          const searchResults = get().searchResults;
          const updatedData = searchResults.data.map(v => 
            v.id === savedVoter.id ? savedVoter : v
          );
          
          set({
            searchResults: { ...searchResults, data: updatedData }
          });
        } catch (error) {
          console.error('Failed to save voter:', error);
          set({
            isSaving: false,
            error: error instanceof Error ? error.message : 'Failed to save voter',
          });
        }
      },

      cancelEditing: () => {
        set({
          editingVoter: null,
          isDirty: false,
        });
      },

      // Booth actions
      loadBooths: async () => {
        set({ error: null });
        
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 300));
          set({ booths: mockBooths });
        } catch (error) {
          console.error('Failed to load booths:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to load booths',
          });
        }
      },

      selectBooth: (booth: Booth | null) => {
        set({ selectedBooth: booth });
      },

      // Statistics actions
      loadStatistics: async () => {
        set({ error: null });
        
        try {
          // Mock API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const mockStatistics: ConstituencyStatistics = {
            totalVoters: 50000,
            totalBooths: 150,
            surveysCompleted: 42500,
            surveyCompletionRate: 85.0,
            mobileNumberCoverage: 78.5,
            lastSyncTimestamp: new Date(),
            boothStatistics: [
              {
                boothNumber: 1,
                totalVoters: 1200,
                surveysCompleted: 1020,
                surveysPending: 180,
                mobileNumbersCollected: 950,
                averageAge: 42.5,
                genderDistribution: { M: 650, F: 540, T: 10 },
                casteDistribution: { General: 400, OBC: 500, SC: 200, ST: 100 },
              },
            ],
          };
          
          set({ statistics: mockStatistics });
        } catch (error) {
          console.error('Failed to load statistics:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to load statistics',
          });
        }
      },

      // Error handling
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'voter-store',
    }
  )
);

// Selectors for voter store
export const useVoterSelectors = () => {
  const store = useVoterStore();
  
  return {
    // Search data
    searchResults: store.searchResults,
    searchFilters: store.searchFilters,
    isSearching: store.isSearching,
    hasResults: store.searchResults.data.length > 0,
    
    // Selected voter data
    selectedVoter: store.selectedVoter,
    isLoadingVoter: store.isLoadingVoter,
    
    // Editing data
    editingVoter: store.editingVoter,
    isEditing: store.editingVoter !== null,
    isDirty: store.isDirty,
    isSaving: store.isSaving,
    
    // Booth data
    booths: store.booths,
    selectedBooth: store.selectedBooth,
    
    // Statistics
    statistics: store.statistics,
    
    // Error state
    error: store.error,
  };
};

// Hook for voter actions
export const useVoterActions = () => {
  const store = useVoterStore();
  
  return {
    // Search actions
    setSearchFilters: store.setSearchFilters,
    searchVoters: store.searchVoters,
    clearSearchResults: store.clearSearchResults,
    
    // Voter actions
    selectVoter: store.selectVoter,
    loadVoter: store.loadVoter,
    
    // Editing actions
    startEditingVoter: store.startEditingVoter,
    updateEditingVoter: store.updateEditingVoter,
    saveVoter: store.saveVoter,
    cancelEditing: store.cancelEditing,
    
    // Booth actions
    loadBooths: store.loadBooths,
    selectBooth: store.selectBooth,
    
    // Statistics actions
    loadStatistics: store.loadStatistics,
    
    // Error handling
    clearError: store.clearError,
  };
};