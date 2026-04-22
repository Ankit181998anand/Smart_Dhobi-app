import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authService } from '../../../services/authService';
import Header from '../../../components/Header';
import GradientButton from '../../../components/GradientButton';
import InputField from '../../../components/InputField';
import { SH } from '../../../utils/Dimensions';
import COLORS from '../../../utils/constant';
import { SVG_ICON } from '../../../assets/Svg/svgIcon';
import styles from '../register/styles';

type VerifyOTPScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'VerifyOTP'>;
    route: { params: { email: string; fromRegister?: boolean } };
};

const VerifyOTPScreen = ({ navigation, route }: VerifyOTPScreenProps) => {
    const { email, fromRegister } = route.params;
    const insets = useSafeAreaInsets();

    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = async () => {
        if (otp.length < 4) {
            Alert.alert('Error', 'Please enter a valid OTP');
            return;
        }

        try {
            setIsLoading(true);
            const response = await authService.verifyOtp({ email, otp });
            setIsLoading(false);

            Alert.alert('Success', response.message || 'Verification successful', [
                {
                    text: 'OK',
                    onPress: () => {
                        if (fromRegister) {
                            navigation.navigate('Login');
                        } else {
                            // If verifying for password reset, navigate to ResetPassword
                            navigation.navigate('ResetPassword', { email, otp });
                        }
                    }
                }
            ]);
        } catch (error: any) {
            setIsLoading(false);
            Alert.alert('Error', error.response?.data?.message || 'Verification failed');
        }
    };

    const handleResend = async () => {
        try {
            await authService.forgotPassword(email);
            setTimer(60);
            Alert.alert('Success', 'OTP resent successfully');
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to resend OTP');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: insets.top, backgroundColor: '#f6f0fc' }} />
            <View style={styles.rightSection}>
                <Header
                    title="Verify OTP"
                    subtitle={`Enter the code sent to ${email}`}
                    textStyle={{ textAlign: 'center' }}
                />

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: SH(50), paddingTop: SH(20) }}
                    >
                        <View style={styles.inputContainer}>
                            <InputField
                                label="OTP Code"
                                placeholder="123456"
                                value={otp}
                                onChangeText={setOtp}
                                keyboardType="number-pad"
                                iconSource={SVG_ICON.lock_Icon(COLORS.DarkGray)}
                            />

                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: SH(20) }}>
                                <Text style={styles.loginText}>Didn't receive code? </Text>
                                <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                                    <Text style={[styles.loginLink, { color: timer > 0 ? COLORS.GRAY_400 : COLORS.PURPLE_600 }]}>
                                        {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <GradientButton
                                title="Verify OTP"
                                onPress={handleVerify}
                                type="filled"
                                loading={isLoading}
                                rightIcon={SVG_ICON.arrow_Right(COLORS.WHITE)}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

export default VerifyOTPScreen;
