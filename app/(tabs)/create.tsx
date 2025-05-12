import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

import ErrorBoundaryWrapper from '@/components/ErrorBoundary';
import ActivityDetailsSheet from '@/components/screens/create/activityDetail/ActivityDetailSheet';
import { styles } from '@/components/screens/create/style';
import TimelineBuilder from '@/components/screens/create/timelineBuilder/TimelineBuilder';
import TopBar from '@/components/screens/create/topBar/TopBar';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTripBuilderStore } from '../../store/tripBuilderStore';

export default function CreateScreen() {
  // Initialize trip when component mounts
  const { initTrip } = useTripBuilderStore();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null!);
  
  useEffect(() => {
    initTrip(3); // Start with 3 days
  }, []);
  
  return (
    <ErrorBoundaryWrapper>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <View style={styles.container}>
            <TopBar />
            <TimelineBuilder bottomSheetModalRef={bottomSheetModalRef} />
            <ActivityDetailsSheet bottomSheetModalRef={bottomSheetModalRef} />
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ErrorBoundaryWrapper>
  );
}