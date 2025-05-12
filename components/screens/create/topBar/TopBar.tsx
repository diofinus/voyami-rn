import { formatCurrency } from "@/models/trip";
import { useTripBuilderStore } from "@/store/tripBuilderStore";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePickerModal from '@react-native-community/datetimepicker';
import { format } from "date-fns";
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, StatusBar, Text, TextInput, View } from "react-native";
import { CalendarIcon } from "react-native-heroicons/outline";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../style";

// Top Bar Component
const TopBar = () => {
  const insets = useSafeAreaInsets();
  const { 
    currentTrip, 
    updateTripTitle, 
    isDatePickerVisible,
    toggleDatePicker,
    updateTripDates,
    publishTrip,
    toggleSocialPreview,
    isLoading,
  } = useTripBuilderStore();
  
  const [tripTitle, setTripTitle] = useState(currentTrip.title);
  const [startDate, setStartDate] = useState(currentTrip.startDate);
  const [endDate, setEndDate] = useState(currentTrip.endDate);
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end'>('start');
  
  // Update local state when trip changes (e.g., on initialization)
  useEffect(() => {
    setTripTitle(currentTrip.title);
    setStartDate(currentTrip.startDate);
    setEndDate(currentTrip.endDate);
  }, [currentTrip.endDate, currentTrip.id, currentTrip.startDate, currentTrip.title]);
  
  const handleTitleChange = (text: string) => {
    setTripTitle(text);
  };
  
  const handleTitleSubmit = () => {
    updateTripTitle(tripTitle);
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (!selectedDate) return;
    
    if (datePickerMode === 'start') {
      setStartDate(selectedDate);
      // If start date is after end date, update end date too
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
      setDatePickerMode('end');
    } else {
      setEndDate(selectedDate);
      toggleDatePicker(); // Close after setting end date
      
      // Update the trip with new date range
      updateTripDates(startDate, selectedDate);
    }
  };
  
  return (
    <View style={[styles.topBar, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.logoContainer}>
        <Image source={require('@/assets/logos/voyami-logo-twotone.png')} style={
          styles.logoImage
        } />
        <View style={styles.tripActionsButtons}>
          <Pressable
            style={styles.previewButton}
            onPress={() => {
              toggleSocialPreview();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            >
            <MaterialIcons name="preview" size={18} color="#fff" />
            <Text style={styles.buttonText}>Preview</Text>
          </Pressable>
          
          <Pressable
            style={styles.publishButton}
            onPress={() => {
              publishTrip();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }}
            disabled={isLoading}
            >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialIcons name="publish" size={18} color="#fff" />
              </>
            )}
          </Pressable>
        </View>
      </View>
      
      {/* Center - Trip Title and Date Range */}
      <View style={styles.tripHeader}>
        <View style={styles.tripTitleContainer}>
          <TextInput
            style={styles.tripTitleInput}
            value={tripTitle}
            onChangeText={handleTitleChange}
            onBlur={handleTitleSubmit}
            placeholder="Enter trip title..."
            placeholderTextColor="#fff"
          />
        </View>
        
        <Pressable
          style={styles.dateRangeButton}
          onPress={() => {
            toggleDatePicker();
            setDatePickerMode('start');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <CalendarIcon size={18} color="#fff" />
          <Text style={styles.dateRangeText}>
            {format(currentTrip.startDate, 'MMM d, yyyy')} - {format(currentTrip.endDate, 'MMM d, yyyy')}
          </Text>
        </Pressable>
        
        {isDatePickerVisible && (
          <DateTimePickerModal
            testID="dateTimePicker"
            value={datePickerMode === 'start' ? startDate : endDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={datePickerMode === 'end' ? startDate : undefined}
          />
        )}
      </View>
      
      <View style={styles.tripActions}>
        <View style={styles.tripTotalPrice}>
          <Text style={styles.tripTotalAmount}>{formatCurrency(currentTrip.totalPrice)}</Text>
        </View>
      </View>
    </View>
  );
};

export default TopBar;