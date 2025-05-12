import { Activity, formatCurrency } from "@/models/trip";
import { useTripBuilderStore } from "@/store/tripBuilderStore";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { PlusIcon, XMarkIcon } from "react-native-heroicons/outline";
import { styles } from "../style";
import ActivitiesList from "./ActivitiesList";

const TripDayCard = ({ 
  day, 
  isSelected, 
  onSelect,
  onRemove,
  onAddActivity,
  bottomSheetModalRef
}: { 
  day: any, 
  isSelected: boolean,
  onSelect: () => void,
  onRemove: () => void,
  onAddActivity: () => void,
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
}) => {
  const { currentTrip } = useTripBuilderStore();
  
  // Calculate date for this day
  const dayDate = useMemo(() => {
    const date = new Date(currentTrip.startDate);
    date.setDate(date.getDate() + day.dayNumber - 1);
    return date;
  }, [currentTrip.startDate, day.dayNumber]);
  
  // Calculate total cost for this day
  const totalCost = useMemo(() => {
    return day.activities.reduce((sum: number, activity: Activity) => sum + activity.cost, 0);
  }, [day.activities]);

  return (
    <View 
      style={[styles.dayCard, isSelected && styles.selectedDayCard]}
    >
      {/* Day Header */}
      <Pressable
        onPress={onSelect}
        style={styles.dayHeader}
      >
        <View>
          <Text style={styles.dayNumber}>Day {day.dayNumber}</Text>
          <Text style={styles.dayDate}>{format(dayDate, 'EEE, MMM d')}</Text>
        </View>
        
        <View style={styles.dayHeaderRight}>
          <Text style={styles.dayCost}>{formatCurrency(totalCost)}</Text>
          
          {currentTrip.days.length > 1 && (
            <Pressable 
              onPress={onRemove}
              style={styles.removeDayButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <XMarkIcon size={16} color="#FF6B6B" />
            </Pressable>
          )}
        </View>
      </Pressable>
      
      {/* Activities List */}
      {day.activities.length > 0 ? (
        <ActivitiesList dayId={day.id} activities={day.activities} bottomSheetModalRef={bottomSheetModalRef} />
      ) : (
        <View style={styles.emptyDayState}>
          <Text style={styles.emptyDayText}>
            No activities yet
          </Text>
        </View>
      )}
      
      <Pressable 
        style={styles.addActivityButton} 
        onPress={onAddActivity}
      >
        <PlusIcon size={18} color="#53C6C6" />
        <Text style={styles.addActivityButtonText}>Add Activity</Text>
      </Pressable>
    </View>
  );
};


export default TripDayCard;