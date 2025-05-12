import { getCategoryColor } from "@/helper/color";
import { Activity, formatCurrency } from "@/models/trip";
import { useTripBuilderStore } from "@/store/tripBuilderStore";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../style";

const AttractionCard = ({ 
  attraction, 
  dayId,
  onAddActivity 
}: { 
  attraction: Activity, 
  dayId: string | null,
  onAddActivity?: () => void
}) => {
  const { addActivity } = useTripBuilderStore();
  
  const handlePress = () => {
    if (!dayId) {
      // Show an error
      alert('Please select a day first');
      return;
    }
    
    // Create a copy with a new ID to allow multiple instances
    const newActivity = {
      ...attraction,
      id: `${attraction.id}-${Date.now()}`
    };
    
    addActivity(newActivity, dayId);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Close dialog after adding
    if (onAddActivity) {
      onAddActivity();
    }
  };
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.attractionCard,
        { opacity: pressed ? 0.7 : 1 }
      ]}
      onPress={handlePress}
    >
      {/* Thumbnail */}
      <Image
        source={{ uri: attraction.imageUrl }}
        style={styles.attractionImage}
        resizeMode="cover"
      />
      
      {/* Category Badge */}
      <View style={[
        styles.categoryBadge,
        { backgroundColor: getCategoryColor(attraction.category) }
      ]}>
        <Text style={styles.categoryBadgeText}>{attraction.category}</Text>
      </View>
      
      {/* Details */}
      <View style={styles.attractionDetails}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Text style={styles.attractionName} numberOfLines={1}>{attraction.name}</Text>
          <MaterialIcons
            name="add-circle"
            size={24}
            color="#53C6C6"
          />
        </View>
        <Text style={styles.attractionLocation} numberOfLines={1}>
          {attraction.address.split(',').pop()?.trim()}
        </Text>
        <View style={styles.attractionMeta}>
          <Text style={styles.attractionPrice}>{formatCurrency(attraction.cost)}</Text>
          <Text style={styles.attractionDuration}>
            {Math.floor(attraction.duration / 60)}h{attraction.duration % 60 > 0 ? ` ${attraction.duration % 60}m` : ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default AttractionCard;