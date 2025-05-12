import { getCategoryColor } from "@/helper/color";
import { formatCurrency } from "@/models/trip";
import { useTripBuilderStore } from "@/store/tripBuilderStore";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import DateTimePickerModal from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, Image, Pressable, Text, TextInput, View } from "react-native";
import { PlusIcon, XMarkIcon } from "react-native-heroicons/outline";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../style";

// Activity Details Bottom Sheet
const ActivityDetailsSheet = ({
  bottomSheetModalRef
}: {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}) => {
  const {
    selectedActivity,
    selectedDayId,
    updateActivity,
    toggleFlexibleTiming,
    setSelectedActivity
  } = useTripBuilderStore();
  
  const insets = useSafeAreaInsets();
  
  // Bottom sheet snap points - Use dynamic calculation with a minimum height
  const snapPoints = useMemo(() => {
    const { height } = Dimensions.get('window');
    return ['55%', height - 100]; // Adjust to use nearly full height
  }, []);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  
  // Reset form when selected activity changes
  useEffect(() => {
    if (selectedActivity) {
      setTitle(selectedActivity.name);
      setDescription(selectedActivity.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [selectedActivity]);

  // Handle closing of the bottom sheet
  const handleClosePress = useCallback(() => {
    bottomSheetModalRef?.current?.close();
  }, [bottomSheetModalRef]);
  
  // Handle when sheet changes position
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      // When sheet is closed, clear selected activity after a short delay
      setTimeout(() => {
        setSelectedActivity(null, selectedDayId);
      }, 100);
    }
  }, [selectedDayId, setSelectedActivity]);
  
  const handleSave = () => {
    if (!selectedActivity || !selectedDayId) return;
    
    updateActivity({
      ...selectedActivity,
      name: title,
      description: description
    }, selectedDayId);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setTimePickerVisible(false);
    if (selectedTime && selectedActivity && selectedDayId) {
      updateActivity({
        ...selectedActivity,
        startTime: `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`,
        isFlexible: false
      }, selectedDayId);
    }
  };
  
  // Handle for the bottom sheet
  const renderHandle = useCallback(() => (
    <View style={[styles.bottomSheetHandle]}>
      <View style={styles.bottomSheetHandleBar} />
    </View>
  ), []);
  
  // Render backdrop component
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop 
        {...props} 
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        enableTouchThrough={false}
        pressBehavior="close"
        opacity={0.7}
      />
    ),
    []
  );
  
  // Return early if no activity is selected
  if (!selectedActivity) {
    return null;
  }
  
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      handleComponent={renderHandle}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: '#c0c0c0' }}
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
      keyboardBehavior="extend"
      android_keyboardInputMode="adjustResize"
      bottomInset={insets.bottom}
    >
      {/* <BottomSheetView style={{ flex: 1 }}> */}
        <BottomSheetScrollView 
          contentContainerStyle={
            { 
              padding: 12,
              paddingBottom: insets.bottom
            }
          }
        >
          <View style={styles.editorImageContainer}>
            <Image
              source={{ uri: selectedActivity.imageUrl }}
              style={styles.editorImage}
              resizeMode="cover"
            />
            <View
              style={[
                styles.editorCategoryBadge,
                { backgroundColor: getCategoryColor(selectedActivity.category) }
              ]}
            >
              <Text style={styles.editorCategoryText}>{selectedActivity.category}</Text>
            </View>
          </View>
          
          {/* Activity Title */}
          <View style={styles.editorField}>
            <Text style={styles.editorLabel}>Title</Text>
            <TextInput
              style={styles.editorInput}
              value={title}
              onChangeText={setTitle}
              onBlur={handleSave}
            />
          </View>
          
          {/* Time Settings */}
          <View style={styles.editorField}>
            <Text style={styles.editorLabel}>Time</Text>
            
            <View style={styles.timeSettings}>
              <Pressable
                style={styles.timePickerButton}
                onPress={() => setTimePickerVisible(true)}
              >
                <MaterialIcons name="schedule" size={20} color="#53C6C6" />
                <Text style={styles.timePickerText}>
                  {selectedActivity.startTime || 'Set time'}
                </Text>
              </Pressable>
              
              <View style={styles.flexibleSwitch}>
                <Text style={styles.flexibleLabel}>Flexible timing</Text>
                <Pressable
                  style={[
                    styles.switchTrack,
                    selectedActivity.isFlexible && styles.switchTrackActive
                  ]}
                  onPress={() => {
                    toggleFlexibleTiming(selectedActivity.id, selectedDayId!);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <View 
                    style={[
                      styles.switchThumb,
                      selectedActivity.isFlexible && styles.switchThumbActive
                    ]} 
                  />
                </Pressable>
              </View>
            </View>
            
            {isTimePickerVisible && (
              <DateTimePickerModal
                testID="timePicker"
                value={new Date()}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={handleTimeChange}
              />
            )}
          </View>
          
          {/* Description */}
          <View style={styles.editorField}>
            <Text style={styles.editorLabel}>Description</Text>
            <TextInput
              style={[styles.editorInput, styles.editorTextarea]}
              value={description}
              onChangeText={setDescription}
              onBlur={handleSave}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          {/* Cost Information */}
          <View style={styles.editorField}>
            <Text style={styles.editorLabel}>Cost</Text>
            <Text style={styles.editorCost}>
              {formatCurrency(selectedActivity.cost)}
            </Text>
          </View>
          
          {/* Duration Information */}
          <View style={styles.editorField}>
            <Text style={styles.editorLabel}>Duration</Text>
            <Text style={styles.editorDuration}>
              {Math.floor(selectedActivity.duration / 60)}h{selectedActivity.duration % 60 > 0 ? ` ${selectedActivity.duration % 60}m` : ''}
            </Text>
          </View>
          
          {/* Backup Activities */}
          <View style={styles.editorField}>
            <Text style={styles.editorLabel}>Backup Activities</Text>
            
            {selectedActivity.backupActivities && selectedActivity.backupActivities.length > 0 ? (
              selectedActivity.backupActivities.map((backup) => (
                <View key={backup.id} style={styles.backupActivity}>
                  <Text style={styles.backupActivityName}>{backup.name}</Text>
                  <Pressable style={styles.backupActivityRemove}>
                    <XMarkIcon size={16} color="#FF6B6B" />
                  </Pressable>
                </View>
              ))
            ) : (
              <Pressable style={styles.addBackupButton}>
                <PlusIcon size={18} color="#53C6C6" />
                <Text style={styles.addBackupText}>Add backup activity</Text>
              </Pressable>
            )}
          </View>
          
          {/* Close Button */}
          <Pressable 
            style={[styles.closeButton, { marginBottom: 40, marginTop: 30 }]}
            onPress={handleClosePress}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </BottomSheetScrollView>
      {/* </BottomSheetView> */}
    </BottomSheetModal>
  );
};

export default ActivityDetailsSheet;