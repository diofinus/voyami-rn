import { useTripBuilderStore } from "@/store/tripBuilderStore";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Haptics from 'expo-haptics';
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { PlusIcon } from "react-native-heroicons/outline";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AttractionsDialog from "../attraction/AttractionDialog";
import { styles } from "../style";
import TripDayCard from "./TripDayCard";

// Timeline Builder Component
const TimelineBuilder = ({
  bottomSheetModalRef
}: {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
}) => {
  const { 
    currentTrip,
    selectedDayId,
    addDay,
    removeDay,
    setSelectedActivity
  } = useTripBuilderStore();
  
  const [isAttractionsVisible, setAttractionsVisible] = useState(false);
  const insets = useSafeAreaInsets();
  
  const handleDaySelect = (dayId: string) => {
    // Select day but don't clear activity
    if (selectedDayId !== dayId) {
      setSelectedActivity(null, dayId);
    }
  };

  return (
    <View style={styles.timelineContainer}>
      <Text style={styles.panelTitle}>Trip Timeline</Text>
      
      {/* Days List */}
      <ScrollView 
        style={styles.daysList}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }} // Add padding to avoid footer overlap
      >
        {currentTrip.days.map((day) => (
          <TripDayCard
            key={day.id}
            day={day}
            isSelected={day.id === selectedDayId}
            onSelect={() => handleDaySelect(day.id)}
            onRemove={() => removeDay(day.id)}
            onAddActivity={() => {
              handleDaySelect(day.id);
              setAttractionsVisible(true);
            }}
            bottomSheetModalRef={bottomSheetModalRef}
          />
        ))}
        
        <Pressable 
          style={styles.addDayButton}
          onPress={() => {
            addDay();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          <PlusIcon size={20} color="#53C6C6" />
          <Text style={styles.addDayButtonText}>Add Day</Text>
        </Pressable>
      </ScrollView>

      {/* Attractions Dialog */}
      <AttractionsDialog 
        isVisible={isAttractionsVisible}
        onClose={() => setAttractionsVisible(false)}
        dayId={selectedDayId}
      />
    </View>
  );
};

export default TimelineBuilder;