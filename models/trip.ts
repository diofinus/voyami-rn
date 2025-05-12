export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Activity {
  id: string;
  name: string;
  location: Coordinates;
  address: string;
  cost: number;
  duration: number; // in minutes
  category: 'Adventure' | 'Food' | 'Culture';
  description: string;
  imageUrl: string;
  isFlexible: boolean;
  startTime?: string; // format: "HH:MM"
  backupActivities?: Activity[];
}

export interface TripDay {
  id: string;
  dayNumber: number;
  activities: Activity[];
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  days: TripDay[];
  totalPrice: number;
  locations: string[];
  creatorId: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Helper functions
export const calculateDayTotal = (activities: Activity[]): number => {
  return activities.reduce((total, activity) => total + activity.cost, 0);
};

export const calculateTripTotal = (days: TripDay[]): number => {
  return days.reduce(
    (total, day) => total + calculateDayTotal(day.activities),
    0
  );
};

export const formatCurrency = (amount: number): string => {
  // Format as Indonesian Rupiah
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const createEmptyDay = (dayNumber: number): TripDay => {
  return {
    id: `day-${dayNumber}-${Date.now()}`,
    dayNumber,
    activities: [],
  };
};

export const createEmptyTrip = (daysCount = 3): Trip => {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + daysCount - 1);
  
  return {
    id: `trip-${Date.now()}`,
    title: 'Your Trip Title',
    startDate: today,
    endDate: endDate,
    days: Array.from({ length: daysCount }, (_, i) => createEmptyDay(i + 1)),
    totalPrice: 0,
    locations: [],
    creatorId: 'user-123', // Replace with actual user ID
    isPublished: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};