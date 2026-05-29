
import React from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import StackNavigator from './StackNavigator';

export const navigationRef = createNavigationContainerRef();

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
