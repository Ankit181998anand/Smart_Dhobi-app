
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splashScreen/splashScreen';
import ChooseRoleScreen from '../screens/chooseRoleScreen/chooseRoleScreen';
import CustomerRegisterScreen from '../screens/auth/register/customerRegister';
import LoginScreen from '../screens/auth/login/loginScreen';
import DhobiRegistrationScreen from '../screens/auth/register/dhobiRegistrationScreen';
import { RootStackParamList } from './types';
import BottomTabNavigator from './BottomTabNavigator';
import OrderDetailsScreen from '../screens/core/orders/orderDetailsScreen';
import ProviderDetailScreen from '../screens/core/dashboard/providerDetailScreen';
import CheckoutScreen from '../screens/core/orders/checkoutScreen';
import ManageServicesScreen from '../screens/core/profile/manageServicesScreen';
import EditProfileScreen from '../screens/core/profile/editProfileScreen';
import AddressListScreen from '../screens/core/profile/addressListScreen';
import ChangePasswordScreen from '../screens/core/profile/ChangePasswordScreen';

import VerifyOTPScreen from '../screens/auth/verifyOtp/verifyOtpScreen';
import ForgotPasswordScreen from '../screens/auth/forgotPassword/forgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/resetPassword/resetPasswordScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="ChooseRole" component={ChooseRoleScreen} />
      <Stack.Screen name="CustomerRegister" component={CustomerRegisterScreen} />
      <Stack.Screen name="DhobiRegistration" component={DhobiRegistrationScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="ProviderDetail" component={ProviderDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="ManageServices" component={ManageServicesScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="AddressList" component={AddressListScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
