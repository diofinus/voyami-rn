import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Discover</ThemedText>
      <ThemedText>This is the discover page.</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});