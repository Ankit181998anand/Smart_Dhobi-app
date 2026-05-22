import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashBoardScreen from '../screens/core/dashboard/dashboardScreen';
import { MainTabParamList, RootStackParamList } from './types';
import COLORS, { FONT_FAMILY_SEMIBOLD } from '../utils/constant';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OrdersScreen from '../screens/core/orders/ordersScreen';
import ProfileScreen from '../screens/core/profile/profileScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SVG_ICON } from '../assets/Svg/svgIcon';
import { SvgXml } from 'react-native-svg';

const Tab = createBottomTabNavigator<MainTabParamList>();

type BottomTabNavigatorProps = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

const BottomTabNavigator = ({ route }: BottomTabNavigatorProps) => {
  const { type } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 13,
          fontFamily: FONT_FAMILY_SEMIBOLD,
        },
        tabBarStyle: {
          backgroundColor: COLORS.WHITE,
          borderTopWidth: 1,
          borderTopColor: '#FAF9F6',
          borderLeftColor: COLORS.WHITE,
          paddingBottom: insets.bottom + 5,
          height: 65 + insets.bottom,
          elevation: 10,
          shadowColor: COLORS.BLACK,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: COLORS.GRAY_400,
        tabBarIcon: ({ color }) => {
          let iconXml;
          switch (route.name) {
            case 'Dashboard':
              iconXml = SVG_ICON.home_Icon(color);
              break;
            case 'Orders':
              iconXml = SVG_ICON.Orders_Icon(color);
              break;
            case 'Profile':
              iconXml = SVG_ICON.PerSon_Add(color);
              break;
            default:
              iconXml = SVG_ICON.home_Icon(color);
          }

          return <SvgXml xml={iconXml} width={24} height={24} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        initialParams={{ type }}
        component={DashBoardScreen}
      />
      <Tab.Screen
        name="Orders"
        initialParams={{ type }}
        component={OrdersScreen}
      />
      <Tab.Screen
        name="Profile"
        initialParams={{ type }}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
