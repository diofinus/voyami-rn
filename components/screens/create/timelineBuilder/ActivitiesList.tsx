import { Activity } from "@/models/trip";
import { useTripBuilderStore } from "@/store/tripBuilderStore";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Haptics from 'expo-haptics';
import React, { useCallback } from "react";
import DraggableFlatList from "react-native-draggable-flatlist";
import ActivityItem from "./ActivityItem";

const ActivitiesList = ({ 
  dayId, 
  activities,
  bottomSheetModalRef
}: { 
  dayId: string, 
  activities: Activity[],
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
}) => {
  const { setSelectedActivity, moveActivity, selectedActivity } = useTripBuilderStore();
  
  const handleActivityPress = useCallback((activity: Activity) => {
    // If this activity is already selected, just present the modal
    // Otherwise, set the selected activity and then present the modal
    if (selectedActivity && selectedActivity.id === activity.id) {
      bottomSheetModalRef.current?.present();
    } else {
      setSelectedActivity(activity, dayId);
      setTimeout(() => {
        bottomSheetModalRef.current?.present();
      }, 10);
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [bottomSheetModalRef, dayId, selectedActivity, setSelectedActivity]);
  
  return (
    <DraggableFlatList
      data={activities}
      keyExtractor={(item) => item.id}
      renderItem={({ item, drag, isActive }) => (
        <ActivityItem 
          activity={item}
          dayId={dayId}
          onDrag={drag}
          isActive={isActive}
          onPress={() => handleActivityPress(item)}
        />
      )}
      onDragEnd={({ from, to }) => {
        // Update the store with the new order
        if (from !== to) {
          const activityId = activities[from].id;
          moveActivity(activityId, dayId, dayId, to);
        }
      }}
      scrollEnabled={false} // Disable scrolling in the DraggableFlatList
    />
  );
};

export default ActivitiesList;