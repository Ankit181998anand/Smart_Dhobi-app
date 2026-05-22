import React, { useEffect } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigations/types";
import FastImage from "react-native-fast-image";
import GradientButton from "../../components/GradientButton";
import COLORS from "../../utils/constant";
import { SVG_ICON } from "../../assets/Svg/svgIcon";
import styles from "./style";

type ChooseRoleScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ChooseRole'>;
};

const ChooseRoleScreen = ({ navigation }: ChooseRoleScreenProps) => {
    useEffect(() => {
        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setTranslucent(true);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.subContainer}>
                <FastImage
                    source={require('../../assets/images/logo-DckSDQYh.png')}
                    style={styles.logo}
                    resizeMode={FastImage.resizeMode.contain}
                />
                
                <Text style={styles.title}>Smart Dhobi</Text>
                <Text style={styles.subTitle}>
                    Clean Clothes, Happy Life.{"\n"}Select your journey to begin.
                </Text>

                <View style={styles.buttonContainer}>
                    <GradientButton
                        title="Register as Customer"
                        onPress={() => navigation.navigate('CustomerRegister')}
                        type="filled"
                        containerStyle={{ marginBottom: 15 }}
                        rightIcon={SVG_ICON.arrow_Right(COLORS.WHITE)}
                    />
                    
                    <GradientButton
                        title="Become a Service Provider"
                        onPress={() => navigation.navigate('DhobiRegistration')}
                        type="outlined"
                        rightIcon={SVG_ICON.arrow_Right(COLORS.PURPLE_600)}
                    />
                </View>

                <View style={styles.loginWrapper}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ChooseRoleScreen;