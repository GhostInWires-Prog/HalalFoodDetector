import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatScreen, HistoryScreen, HomeScreen, ScannerScreen } from '../screens';

export type MainTabParamList = {
  Home: undefined;
  Scanner: undefined;
  History: undefined;
  Chat: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  const insets = useSafeAreaInsets();

  const tabBarStyle = useMemo(
    () => ({
      backgroundColor: '#050816',
      borderTopWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
      height: 62 + insets.bottom,
      paddingBottom: Math.max(12, insets.bottom + 6),
      paddingTop: 8,
    }),
    [insets.bottom],
  );

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<keyof MainTabParamList, string> = {
            Home: focused ? 'planet' : 'planet-outline',
            Scanner: focused ? 'scan' : 'scan-outline',
            History: focused ? 'albums' : 'albums-outline',
            Chat: focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline',
          };

          const iconName = icons[route.name as keyof MainTabParamList];
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Scanner" component={ScannerScreen} options={{ title: 'Scan' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
    </Tab.Navigator>
  );
}


