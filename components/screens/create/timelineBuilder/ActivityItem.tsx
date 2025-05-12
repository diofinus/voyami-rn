import { Activity, formatCurrency } from "@/models/trip";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../style";


const ActivityItem = ({
  activity,
  dayId,
  onDrag,
  isActive,
  onPress
}: {
  activity: Activity,
  dayId: string,
  onDrag: () => void,
  isActive: boolean,
  onPress: () => void
}) => {
  return (
    <Pressable
      style={[
        styles.activityItem,
        isActive && styles.activityDragging
      ]}
      onPress={onPress}
    >
      {/* Activity Time */}
      <View style={styles.activityTimeContainer}>
        {activity.isFlexible ? (
          <Text style={styles.activityFlexibleTime}>Flexible</Text>
        ) : activity.startTime ? (
          <Text style={styles.activityTime}>{activity.startTime}</Text>
        ) : (
          <Text style={styles.activityNoTime}>No time set</Text>
        )}
      </View>
      
      {/* Activity Content */}
      <View style={styles.activityContent}>
        <Image
          source={{ uri: activity.imageUrl }}
          style={styles.activityImage}
          resizeMode="cover"
        />
        
        <View style={styles.activityDetails}>
          <Text style={styles.activityName} numberOfLines={1}>
            {activity.name}
          </Text>
          <Text style={styles.activityDuration}>
            {Math.floor(activity.duration / 60)}h{activity.duration % 60 > 0 ? ` ${activity.duration % 60}m` : ''}
          </Text>
          {activity.backupActivities && activity.backupActivities.length > 0 && (
            <Text style={styles.activityBackups}>
              {activity.backupActivities.length} backup{activity.backupActivities.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        
        <Text style={styles.activityPrice}>
          {formatCurrency(activity.cost)}
        </Text>
      </View>

      {/* Drag Handle Icon */}
      <Pressable 
        style={styles.dragHandleContainer}
        onLongPress={onDrag}
      >
        <MaterialIcons name="drag-handle" size={20} color="#999" />
      </Pressable>
    </Pressable>
  );
};

export default ActivityItem;