import { create } from 'zustand';
import { mockAttractions, searchAttractions } from '../models/mockAttractions';
import {
    Activity,
    Trip,
    calculateTripTotal,
    createEmptyDay,
    createEmptyTrip
} from '../models/trip';

interface TripBuilderStore {
  // Current trip being edited
  currentTrip: Trip;
  
  // Attractions library state
  attractions: Activity[];
  filteredAttractions: Activity[];
  searchQuery: string;
  categoryFilter: string | null;
  locationFilter: string | null;
  
  // Selected activity for editing in right panel
  selectedActivity: Activity | null;
  selectedDayId: string | null;
  
  // UI state
  isDatePickerVisible: boolean;
  isSocialPreviewVisible: boolean;
  isLoading: boolean;
  
  // Actions
  initTrip: (daysCount?: number) => void;
  updateTripTitle: (title: string) => void;
  updateTripDates: (startDate: Date, endDate: Date) => void;
  addDay: () => void;
  removeDay: (dayId: string) => void;
  addActivity: (activity: Activity, dayId: string) => void;
  removeActivity: (activityId: string, dayId: string) => void;
  updateActivity: (activity: Activity, dayId: string) => void;
  moveActivity: (activityId: string, fromDayId: string, toDayId: string, newIndex: number) => void;
  setSelectedActivity: (activity: Activity | null, dayId: string | null) => void;
  searchLibrary: (query: string) => void;
  filterByCategory: (category: string | null) => void;
  filterByLocation: (location: string | null) => void;
  publishTrip: () => Promise<void>;
  saveDraft: () => Promise<void>;
  toggleDatePicker: () => void;
  toggleSocialPreview: () => void;
  addBackupActivity: (mainActivityId: string, backupActivityId: string, dayId: string) => void;
  removeBackupActivity: (mainActivityId: string, backupActivityId: string, dayId: string) => void;
  toggleFlexibleTiming: (activityId: string, dayId: string) => void;
}

export const useTripBuilderStore = create<TripBuilderStore>((set, get) => ({
  currentTrip: createEmptyTrip(),
  attractions: mockAttractions,
  filteredAttractions: mockAttractions,
  searchQuery: '',
  categoryFilter: null,
  locationFilter: null,
  selectedActivity: null,
  selectedDayId: null,
  isDatePickerVisible: false,
  isSocialPreviewVisible: false,
  isLoading: false,
  
  initTrip: (daysCount = 3) => {
    set({ currentTrip: createEmptyTrip(daysCount) });
  },
  
  updateTripTitle: (title: string) => {
    set(state => ({ 
      currentTrip: { 
        ...state.currentTrip, 
        title, 
        updatedAt: new Date() 
      } 
    }));
  },
  
  updateTripDates: (startDate: Date, endDate: Date) => {
    const dayCount = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    set(state => {
      // Get current days
      const currentDays = state.currentTrip.days;
      // Calculate how many days to add or remove
      const diff = dayCount - currentDays.length;
      
      let newDays = [...currentDays];
      
      if (diff > 0) {
        // Add days
        for (let i = 0; i < diff; i++) {
          newDays.push(createEmptyDay(currentDays.length + i + 1));
        }
      } else if (diff < 0) {
        // Remove days from the end
        newDays = newDays.slice(0, dayCount);
      }
      
      return {
        currentTrip: {
          ...state.currentTrip,
          startDate,
          endDate,
          days: newDays,
          totalPrice: calculateTripTotal(newDays),
          updatedAt: new Date()
        }
      };
    });
  },
  
  addDay: () => {
    set(state => {
      const newDays = [...state.currentTrip.days, createEmptyDay(state.currentTrip.days.length + 1)];
      
      // Update end date
      const newEndDate = new Date(state.currentTrip.endDate);
      newEndDate.setDate(newEndDate.getDate() + 1);
      
      return { 
        currentTrip: { 
          ...state.currentTrip,
          days: newDays,
          endDate: newEndDate,
          updatedAt: new Date()
        } 
      };
    });
  },
  
  removeDay: (dayId: string) => {
    set(state => {
      // Find and remove the day
      const newDays = state.currentTrip.days.filter(day => day.id !== dayId);
      
      // Re-number the days
      const updatedDays = newDays.map((day, index) => ({
        ...day,
        dayNumber: index + 1
      }));
      
      // Update end date
      const newEndDate = new Date(state.currentTrip.startDate);
      newEndDate.setDate(newEndDate.getDate() + updatedDays.length - 1);
      
      return { 
        currentTrip: { 
          ...state.currentTrip,
          days: updatedDays,
          endDate: newEndDate,
          totalPrice: calculateTripTotal(updatedDays),
          updatedAt: new Date()
        } 
      };
    });
  },
  
  addActivity: (activity: Activity, dayId: string) => {
    set(state => {
      const newDays = state.currentTrip.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            activities: [...day.activities, activity]
          };
        }
        return day;
      });
      
      const updatedTrip = {
        ...state.currentTrip,
        days: newDays,
        totalPrice: calculateTripTotal(newDays),
        updatedAt: new Date()
      };
      
      // Add to locations if not already included
      if (!updatedTrip.locations.includes(activity.address.split(',').pop()?.trim() || '')) {
        const location = activity.address.split(',').pop()?.trim();
        if (location) {
          updatedTrip.locations = [...updatedTrip.locations, location];
        }
      }
      
      return { currentTrip: updatedTrip };
    });
  },
  
  removeActivity: (activityId: string, dayId: string) => {
    set(state => {
      const newDays = state.currentTrip.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            activities: day.activities.filter(activity => activity.id !== activityId)
          };
        }
        return day;
      });
      
      const updatedTrip = {
        ...state.currentTrip,
        days: newDays,
        totalPrice: calculateTripTotal(newDays),
        updatedAt: new Date()
      };
      
      // Clear the selected activity if it was the one removed
      if (state.selectedActivity && state.selectedActivity.id === activityId) {
        return {
          currentTrip: updatedTrip,
          selectedActivity: null,
          selectedDayId: null
        };
      }
      
      return { currentTrip: updatedTrip };
    });
  },
  
  updateActivity: (activity: Activity, dayId: string) => {
    set(state => {
      const newDays = state.currentTrip.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            activities: day.activities.map(act => 
              act.id === activity.id ? activity : act
            )
          };
        }
        return day;
      });
      
      // Also update if it's the selected activity
      let updatedSelectedActivity = state.selectedActivity;
      if (state.selectedActivity && state.selectedActivity.id === activity.id) {
        updatedSelectedActivity = activity;
      }
      
      return { 
        currentTrip: { 
          ...state.currentTrip,
          days: newDays,
          totalPrice: calculateTripTotal(newDays),
          updatedAt: new Date()
        },
        selectedActivity: updatedSelectedActivity
      };
    });
  },
  
  moveActivity: (activityId: string, fromDayId: string, toDayId: string, newIndex: number) => {
    set(state => {
      // First find and remove the activity from the source day
      let activityToMove: Activity | undefined;
      
      const daysAfterRemoval = state.currentTrip.days.map(day => {
        if (day.id === fromDayId) {
          const activityIndex = day.activities.findIndex(act => act.id === activityId);
          if (activityIndex > -1) {
            activityToMove = day.activities[activityIndex];
            return {
              ...day,
              activities: day.activities.filter(act => act.id !== activityId)
            };
          }
        }
        return day;
      });
      
      if (!activityToMove) {
        return state; // Nothing to move
      }
      
      // Then add the activity to the destination day at the specified index
      const finalDays = daysAfterRemoval.map(day => {
        if (day.id === toDayId) {
          const newActivities = [...day.activities];
          newActivities.splice(newIndex, 0, activityToMove!);
          return {
            ...day,
            activities: newActivities
          };
        }
        return day;
      });
      
      return { 
        currentTrip: { 
          ...state.currentTrip,
          days: finalDays,
          totalPrice: calculateTripTotal(finalDays),
          updatedAt: new Date()
        } 
      };
    });
  },
  
  setSelectedActivity: (activity: Activity | null, dayId: string | null) => {
    set({ selectedActivity: activity, selectedDayId: dayId });
  },
  
  searchLibrary: (query: string) => {
    set(state => {
      const filteredResults = query ? 
        searchAttractions(query) : 
        state.attractions;
        
      // Apply any active category or location filters to the search results
      let finalResults = filteredResults;
      
      if (state.categoryFilter) {
        finalResults = finalResults.filter(attr => attr.category === state.categoryFilter);
      }
      
      if (state.locationFilter) {
        const location = state.locationFilter.trim();
        finalResults = finalResults.filter(attr => 
          attr.address.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      return { 
        searchQuery: query,
        filteredAttractions: finalResults
      };
    });
  },
  
  filterByCategory: (category: string | null) => {
    set(state => {
      let filtered = state.attractions;
      
      // Apply category filter if set
      if (category) {
        filtered = filtered.filter(attr => attr.category === category);
      }
      
      // Apply location filter if it's already set
      if (state.locationFilter) {
        const location = state.locationFilter.trim();
        filtered = filtered.filter(attr => 
          attr.address.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      // Apply search query if it's already set
      if (state.searchQuery) {
        filtered = searchAttractions(state.searchQuery).filter(attr => filtered.some(f => f.id === attr.id));
      }
      
      return { 
        categoryFilter: category,
        filteredAttractions: filtered
      };
    });
  },
  
  filterByLocation: (location: string | null) => {
    set(state => {
      let filtered = state.attractions;
      
      // Apply location filter if set
      if (location) {
        const locationTerm = location.trim();
        filtered = filtered.filter(attr => 
          attr.address.toLowerCase().includes(locationTerm.toLowerCase())
        );
      }
      
      // Apply category filter if it's already set
      if (state.categoryFilter) {
        filtered = filtered.filter(attr => attr.category === state.categoryFilter);
      }
      
      // Apply search query if it's already set
      if (state.searchQuery) {
        filtered = searchAttractions(state.searchQuery).filter(attr => filtered.some(f => f.id === attr.id));
      }
      
      return { 
        locationFilter: location,
        filteredAttractions: filtered
      };
    });
  },
  
  publishTrip: async () => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        isLoading: false,
        currentTrip: {
          ...state.currentTrip,
          isPublished: true,
          updatedAt: new Date()
        }
      }));
      
      // In a real app, you would call your Supabase service here
      // await supabase.from('trips').upsert(get().currentTrip);
    } catch (error) {
      console.error('Failed to publish trip:', error);
      set({ isLoading: false });
    }
  },
  
  saveDraft: async () => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        isLoading: false,
        currentTrip: {
          ...state.currentTrip,
          updatedAt: new Date()
        }
      }));
      
      // In a real app, you would call your Supabase service here
      // await supabase.from('trips').upsert(get().currentTrip);
    } catch (error) {
      console.error('Failed to save draft:', error);
      set({ isLoading: false });
    }
  },
  
  toggleDatePicker: () => {
    set(state => ({ isDatePickerVisible: !state.isDatePickerVisible }));
  },
  
  toggleSocialPreview: () => {
    set(state => ({ isSocialPreviewVisible: !state.isSocialPreviewVisible }));
  },
  
  addBackupActivity: (mainActivityId: string, backupActivityId: string, dayId: string) => {
    const backupActivity = mockAttractions.find(attr => attr.id === backupActivityId);
    
    if (!backupActivity) {
      return;
    }
    
    set(state => {
      const newDays = state.currentTrip.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            activities: day.activities.map(activity => {
              if (activity.id === mainActivityId) {
                const backupActivities = activity.backupActivities || [];
                return {
                  ...activity,
                  backupActivities: [...backupActivities, backupActivity]
                };
              }
              return activity;
            })
          };
        }
        return day;
      });
      
      // Also update if it's the selected activity
      let updatedSelectedActivity = state.selectedActivity;
      if (state.selectedActivity && state.selectedActivity.id === mainActivityId) {
        updatedSelectedActivity = {
          ...state.selectedActivity,
          backupActivities: [...(state.selectedActivity.backupActivities || []), backupActivity]
        };
      }
      
      return { 
        currentTrip: { 
          ...state.currentTrip,
          days: newDays,
          updatedAt: new Date()
        },
        selectedActivity: updatedSelectedActivity
      };
    });
  },
  
  removeBackupActivity: (mainActivityId: string, backupActivityId: string, dayId: string) => {
    set(state => {
      const newDays = state.currentTrip.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            activities: day.activities.map(activity => {
              if (activity.id === mainActivityId && activity.backupActivities) {
                return {
                  ...activity,
                  backupActivities: activity.backupActivities.filter(
                    backup => backup.id !== backupActivityId
                  )
                };
              }
              return activity;
            })
          };
        }
        return day;
      });
      
      // Also update if it's the selected activity
      let updatedSelectedActivity = state.selectedActivity;
      if (state.selectedActivity && state.selectedActivity.id === mainActivityId && state.selectedActivity.backupActivities) {
        updatedSelectedActivity = {
          ...state.selectedActivity,
          backupActivities: state.selectedActivity.backupActivities.filter(
            backup => backup.id !== backupActivityId
          )
        };
      }
      
      return { 
        currentTrip: { 
          ...state.currentTrip,
          days: newDays,
          updatedAt: new Date()
        },
        selectedActivity: updatedSelectedActivity
      };
    });
  },
  
  toggleFlexibleTiming: (activityId: string, dayId: string) => {
    set(state => {
      const newDays = state.currentTrip.days.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            activities: day.activities.map(activity => {
              if (activity.id === activityId) {
                return {
                  ...activity,
                  isFlexible: !activity.isFlexible,
                  // Clear start time if flexible
                  ...(!activity.isFlexible ? { startTime: undefined } : {})
                };
              }
              return activity;
            })
          };
        }
        return day;
      });
      
      // Also update if it's the selected activity
      let updatedSelectedActivity = state.selectedActivity;
      if (state.selectedActivity && state.selectedActivity.id === activityId) {
        updatedSelectedActivity = {
          ...state.selectedActivity,
          isFlexible: !state.selectedActivity.isFlexible,
          // Clear start time if flexible
          ...(!state.selectedActivity.isFlexible ? { startTime: undefined } : {})
        };
      }
      
      return { 
        currentTrip: { 
          ...state.currentTrip,
          days: newDays,
          updatedAt: new Date()
        },
        selectedActivity: updatedSelectedActivity
      };
    });
  }
}));