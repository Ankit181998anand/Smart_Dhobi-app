import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp, NavigatorScreenParams, CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Splash: undefined;
    ChooseRole: undefined;
    CustomerRegister: undefined;
    DhobiRegistration: undefined;
    Login: undefined;
    VerifyOTP: { email: string; fromRegister: boolean };
    ForgotPassword: undefined;
    ResetPassword: { email: string; otp: string };
    MainTabs: NavigatorScreenParams<MainTabParamList> & { type: 'dhobi' | 'customer' };
    OrderDetails: { orderId: string };
    ProviderDetail: { providerId: string };
    Checkout: { providerId: string; items: any[]; selectedAddress?: string };
    ManageServices: undefined;
    EditProfile: undefined;
    AddressList: { fromCheckout?: boolean };
    ChangePassword: undefined;
};

export type MainTabParamList = {
    Dashboard: { type: 'dhobi' | 'customer' };
    Orders: { type: 'dhobi' | 'customer' };
    Profile: { type: 'dhobi' | 'customer' };
};


// ---- Screen Props Types ----
export type DashBoardScreenProps = {
    navigation: CompositeNavigationProp<
        BottomTabNavigationProp<MainTabParamList, 'Dashboard'>,
        NativeStackNavigationProp<RootStackParamList>
    >;
    route: RouteProp<MainTabParamList, 'Dashboard'>;
};

export type OrdersScreenProps = {
    navigation: CompositeNavigationProp<
        BottomTabNavigationProp<MainTabParamList, 'Orders'>,
        NativeStackNavigationProp<RootStackParamList>
    >;
    route: RouteProp<MainTabParamList, 'Orders'>;
};

export type ProfileScreenProps = {
    navigation: CompositeNavigationProp<
        BottomTabNavigationProp<MainTabParamList, 'Profile'>,
        NativeStackNavigationProp<RootStackParamList>
    >;
    route: RouteProp<MainTabParamList, 'Profile'>;
};
