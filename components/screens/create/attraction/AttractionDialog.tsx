import { useTripBuilderStore } from "@/store/tripBuilderStore";
import * as Haptics from 'expo-haptics';
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/outline";
import { styles } from "../style";
import AttractionCard from "./AttractionCard";

const AttractionsDialog = ({ 
  isVisible, 
  onClose,
  dayId 
}: { 
  isVisible: boolean, 
  onClose: () => void,
  dayId: string | null
}) => {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Adventure' | 'Food' | 'Culture'>('All');
  
  const {
    filteredAttractions,
    searchLibrary,
    filterByCategory,
  } = useTripBuilderStore();

  const handleSearch = (text: string) => {
    setSearchText(text);
    searchLibrary(text);
  };

  const handleTabPress = (tab: 'All' | 'Adventure' | 'Food' | 'Culture') => {
    setActiveTab(tab);
    
    // Apply category filter, or clear it if "All" is selected
    if (tab === 'All') {
      filterByCategory(null);
    } else {
      filterByCategory(tab);
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Activity</Text>
            <Pressable onPress={onClose}>
              <XMarkIcon size={24} color="#333" />
            </Pressable>
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <MagnifyingGlassIcon size={20} color="#555" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search attractions..."
              value={searchText}
              onChangeText={handleSearch}
              placeholderTextColor="#999"
            />
            {searchText !== '' && (
              <Pressable onPress={() => handleSearch('')}>
                <XMarkIcon size={20} color="#555" />
              </Pressable>
            )}
          </View>
          
          {/* Category Tabs */}
          <View style={styles.categoryTabs}>
            {(['All', 'Adventure', 'Food', 'Culture'] as const).map((tab) => (
              <Pressable
                key={tab}
                style={[
                  styles.categoryTab,
                  activeTab === tab && styles.activeTab
                ]}
                onPress={() => handleTabPress(tab)}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    activeTab === tab && styles.activeTabText
                  ]}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>
          
          {/* Attractions List */}
          <ScrollView style={styles.attractionsList}>
            {filteredAttractions.length > 0 ? (
              filteredAttractions.map((attraction) => (
                <AttractionCard
                  key={attraction.id}
                  attraction={attraction}
                  dayId={dayId}
                  onAddActivity={onClose}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No attractions found.</Text>
                <Text style={styles.emptyStateSubtext}>Try another search term or filter.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AttractionsDialog;