import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#6C757D',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
            height: 60,
            paddingTop: 5,
            paddingBottom: 5,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={({ navigation }) => ({
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house" color={color} />,
          tabBarItemStyle: styles.tabBarItem,
          tabBarLabelStyle: navigation.isFocused() ? styles.activeTabLabel : styles.tabBarLabel,
        })}
      />
      <Tabs.Screen
        name="discover"
        options={({ navigation }) => ({
          title: 'Discover',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="magnifyingglass" color={color} />,
          tabBarItemStyle: styles.tabBarItem,
          tabBarLabelStyle: navigation.isFocused() ? styles.activeTabLabel : styles.tabBarLabel,
        })}
      />
      <Tabs.Screen
        name="create"
        options={({ navigation }) => ({
          title: 'Create',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="sparkles" color={color} />,
          tabBarItemStyle: styles.tabBarItem,
          tabBarLabelStyle: navigation.isFocused() ? styles.activeTabLabel : styles.tabBarLabel,
        })}
      />
      <Tabs.Screen
        name="explore"
        options={({ navigation }) => ({
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="globe" color={color} />,
          tabBarItemStyle: styles.tabBarItem,
          tabBarLabelStyle: navigation.isFocused() ? styles.activeTabLabel : styles.tabBarLabel,
        })}
      />
      <Tabs.Screen
        name="profile"
        options={({ navigation }) => ({
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person" color={color} />,
          tabBarItemStyle: styles.tabBarItem,
          tabBarLabelStyle: navigation.isFocused() ? styles.activeTabLabel : styles.tabBarLabel,
        })}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarItem: {
    marginVertical: 5,
  },
  tabBarLabel: {
    fontSize: 12,
  },
  activeTabLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
