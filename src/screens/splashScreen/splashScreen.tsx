import React, { useEffect, useRef } from "react";
import { StatusBar, Animated } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigations/types";
import FastImage from 'react-native-fast-image';
import styles from "./style";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { View } from "react-native";

type SplashScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

const SplashScreen = ({ navigation }: SplashScreenProps) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setTranslucent(true);

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            if (isAuthenticated && user) {
                const mappedRole = (user.role === 'user' ? 'customer' : user.role) as 'customer' | 'dhobi';
                navigation.replace('MainTabs', {
                    type: mappedRole,
                    screen: 'Dashboard',
                    params: { type: mappedRole }
                });
            } else {
                navigation.replace('ChooseRole');
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, [isAuthenticated, user, navigation, fadeAnim]);

    return (
        <View style={styles.container}>
            <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: fadeAnim }] }}>
                <FastImage
                    source={require('../../assets/images/logo-DckSDQYh.png')}
                    style={styles.logo}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </Animated.View>
        </View>
    );
};

export default SplashScreen;