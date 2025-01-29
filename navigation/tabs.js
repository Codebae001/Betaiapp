import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FreeScreen from '../screens/FreeScreen';
import PremiumScreen from '../screens/PremiumScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HelpScreen from '../screens/HelpScreen';

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Free') {
            iconName = focused ? 'albums' : 'albums-outline';
          } else if (route.name === 'Premium') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline'; // Icon for History
          } else if (route.name === 'Help') {
            iconName = focused ? 'help-circle' : 'help-circle-outline'; // Icon for Help
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Free" component={FreeScreen} />
      <Tab.Screen name="Premium" component={PremiumScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Help" component={HelpScreen} />
    </Tab.Navigator>
  );
};

export default Tabs;
